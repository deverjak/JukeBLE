/**
 * BLE central — react-native-ble-plx singleton.
 *
 * Responsibilities per the architecture doc:
 *  - scan filtered by the jukebox service UUID (never by name),
 *  - connect + discover + subscribe to the UID characteristic (NOTIFY),
 *  - decode base64 notifications to hex UID strings,
 *  - auto-reconnect with exponential backoff (1 s → 2 s → 5 s), then wait
 *    for a manual action,
 *  - remember the paired device id for reconnect on app start.
 */
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager, State, type Device, type Subscription } from 'react-native-ble-plx';

import {
  BLE_SERVICE_UUID,
  BLE_UID_CHARACTERISTIC_UUID,
  CONNECT_TIMEOUT_MS,
  RECONNECT_DELAYS_MS,
  RSSI_POLL_MS,
  SCAN_TIMEOUT_MS,
} from '../constants/ble';
import type { ConnectionStatus, DeviceInfo } from '../types';
import { decodeUidBase64 } from '../utils/uid';
import { getSavedDevice, setSavedDevice } from './settings';

export interface BleHandlers {
  onConnectionChange: (status: ConnectionStatus, device: DeviceInfo | null) => void;
  onUid: (uid: string) => void;
  onError: (message: string) => void;
}

class BleService {
  private manager: BleManager | null = null;
  private device: Device | null = null;
  private info: DeviceInfo | null = null;
  private status: ConnectionStatus = 'disconnected';

  private monitorSub: Subscription | null = null;
  private disconnectSub: Subscription | null = null;
  private stateSub: Subscription | null = null;

  private scanTimer: ReturnType<typeof setTimeout> | null = null;
  private scanStopResolve: (() => void) | null = null;
  private rssiTimer: ReturnType<typeof setInterval> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryAttempt = 0;
  private intentionalDisconnect = false;

  private handlers: BleHandlers = {
    onConnectionChange: () => {},
    onUid: () => {},
    onError: () => {},
  };

  init(handlers: BleHandlers): void {
    this.handlers = handlers;
    if (!this.manager) this.manager = new BleManager();
    this.stateSub?.remove();
    this.stateSub = this.manager.onStateChange((state) => {
      if (state === State.PoweredOff) {
        const wasConnected = this.device != null;
        this.clearRetry();
        this.stopScanInternal();
        this.cleanupConnection();
        this.setStatus('disconnected', null);
        if (wasConnected) this.handlers.onError('Bluetooth byl vypnut — čtečka odpojena');
      }
    }, false);
  }

  destroy(): void {
    this.clearRetry();
    this.stopScanInternal();
    this.cleanupConnection();
    this.stateSub?.remove();
    this.stateSub = null;
    this.manager?.destroy();
    this.manager = null;
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  /* ── Permissions ────────────────────────────────────────── */

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    const apiLevel = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version), 10);
    if (apiLevel >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    // Android ≤ 11 requires fine location for BLE scanning
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  /* ── Scan ───────────────────────────────────────────────── */

  /**
   * Scans for jukebox readers (filtered by service UUID). Resolves when the
   * scan stops — after the timeout, on error, or via stopScan().
   */
  async startScan(onDevice: (device: DeviceInfo) => void): Promise<void> {
    if (!this.manager) return;
    const allowed = await this.requestPermissions();
    if (!allowed) {
      this.handlers.onError('Bez oprávnění Bluetooth nelze skenovat');
      return;
    }
    const state = await this.manager.state();
    if (state !== State.PoweredOn) {
      this.handlers.onError('Zapněte Bluetooth a zkuste to znovu');
      return;
    }

    this.stopScanInternal();
    if (this.status === 'disconnected') this.setStatus('scanning', this.info);

    return new Promise<void>((resolve) => {
      this.scanStopResolve = resolve;
      this.manager!.startDeviceScan([BLE_SERVICE_UUID], null, (error, device) => {
        if (error) {
          this.handlers.onError(`Sken selhal: ${error.message}`);
          this.stopScan();
          return;
        }
        if (device) {
          onDevice({ id: device.id, name: device.name ?? device.localName ?? null, rssi: device.rssi ?? null });
        }
      });
      this.scanTimer = setTimeout(() => this.stopScan(), SCAN_TIMEOUT_MS);
    });
  }

  stopScan(): void {
    this.stopScanInternal();
    if (this.status === 'scanning') this.setStatus('disconnected', this.info);
  }

  private stopScanInternal(): void {
    if (this.scanTimer) {
      clearTimeout(this.scanTimer);
      this.scanTimer = null;
    }
    this.manager?.stopDeviceScan();
    this.scanStopResolve?.();
    this.scanStopResolve = null;
  }

  /* ── Connect / disconnect ───────────────────────────────── */

  async connect(deviceId: string, name?: string | null): Promise<boolean> {
    if (!this.manager) return false;
    this.stopScanInternal();
    this.intentionalDisconnect = false;
    this.setStatus(this.retryAttempt > 0 ? 'reconnecting' : 'connecting', {
      id: deviceId,
      name: name ?? null,
      rssi: null,
    });

    try {
      const device = await this.manager.connectToDevice(deviceId, { timeout: CONNECT_TIMEOUT_MS });
      await device.discoverAllServicesAndCharacteristics();

      this.device = device;
      this.disconnectSub = device.onDisconnected(() => this.handleUnexpectedDisconnect());
      this.monitorSub = device.monitorCharacteristicForService(
        BLE_SERVICE_UUID,
        BLE_UID_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          // errors here mean the link dropped — onDisconnected handles that
          if (error || !characteristic?.value) return;
          const uid = decodeUidBase64(characteristic.value);
          if (uid) this.handlers.onUid(uid);
        }
      );

      let rssi: number | null = null;
      try {
        rssi = (await device.readRSSI()).rssi ?? null;
      } catch {
        // RSSI is cosmetic
      }

      this.info = { id: deviceId, name: device.name ?? name ?? null, rssi };
      this.retryAttempt = 0;
      setSavedDevice({ id: deviceId, name: this.info.name });
      this.setStatus('connected', this.info);
      this.startRssiPoll();
      return true;
    } catch {
      this.cleanupConnection();
      if (this.retryAttempt === 0) this.setStatus('disconnected', null);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.intentionalDisconnect = true;
    this.clearRetry();
    const device = this.device;
    this.cleanupConnection();
    if (device) {
      try {
        await device.cancelConnection();
      } catch {
        // already disconnected
      }
    }
    this.setStatus('disconnected', null);
  }

  /** Tries to reconnect to the saved reader once Bluetooth is powered on (app start). */
  tryAutoReconnect(): void {
    if (!this.manager) return;
    const saved = getSavedDevice();
    if (!saved) return;

    const sub = this.manager.onStateChange(async (state) => {
      if (state !== State.PoweredOn) return;
      sub.remove();
      if (this.status !== 'disconnected') return;
      const allowed = await this.requestPermissions();
      if (!allowed) return;
      await this.connect(saved.id, saved.name);
    }, true);
  }

  /* ── Internals ──────────────────────────────────────────── */

  private handleUnexpectedDisconnect(): void {
    this.cleanupConnection();
    if (this.intentionalDisconnect) {
      this.setStatus('disconnected', null);
      return;
    }
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    const saved = this.info ?? getSavedDevice();
    if (!saved) {
      this.setStatus('disconnected', null);
      return;
    }
    if (this.retryAttempt >= RECONNECT_DELAYS_MS.length) {
      this.retryAttempt = 0;
      this.setStatus('disconnected', null);
      this.handlers.onError('Spojení se čtečkou se nepodařilo obnovit');
      return;
    }
    const delay = RECONNECT_DELAYS_MS[this.retryAttempt];
    this.retryAttempt += 1;
    this.setStatus('reconnecting', { id: saved.id, name: saved.name ?? null, rssi: null });
    this.retryTimer = setTimeout(async () => {
      const ok = await this.connect(saved.id, saved.name ?? null);
      if (!ok && !this.intentionalDisconnect) this.scheduleReconnect();
    }, delay);
  }

  private startRssiPoll(): void {
    this.rssiTimer = setInterval(async () => {
      if (!this.device) return;
      try {
        const updated = await this.device.readRSSI();
        if (this.info && this.status === 'connected') {
          this.info = { ...this.info, rssi: updated.rssi ?? this.info.rssi };
          this.setStatus('connected', this.info);
        }
      } catch {
        // link probably dropping — onDisconnected will fire
      }
    }, RSSI_POLL_MS);
  }

  private cleanupConnection(): void {
    this.monitorSub?.remove();
    this.monitorSub = null;
    this.disconnectSub?.remove();
    this.disconnectSub = null;
    if (this.rssiTimer) {
      clearInterval(this.rssiTimer);
      this.rssiTimer = null;
    }
    this.device = null;
  }

  private clearRetry(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.retryAttempt = 0;
  }

  private setStatus(status: ConnectionStatus, info: DeviceInfo | null): void {
    this.status = status;
    this.info = info;
    this.handlers.onConnectionChange(status, info);
  }
}

export const ble = new BleService();

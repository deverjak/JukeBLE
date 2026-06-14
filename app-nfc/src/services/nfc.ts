/**
 * NFC reader — react-native-nfc-manager singleton.
 *
 * The NFC counterpart of the BLE service. Where the BLE variant connected to an
 * external ESP32 reader and subscribed to UID notifications, here the phone's own
 * NFC antenna reads tags directly — so there is no device, no pairing and no
 * reconnect logic. Responsibilities:
 *  - detect NFC support + whether it is enabled in system settings,
 *  - listen for tag taps (continuous on Android, per-session on iOS),
 *  - normalise the tag id to the hex UID string the app uses,
 *  - surface status changes (unsupported / disabled / idle / scanning),
 *  - emit a human-readable event log for on-device diagnostics.
 *
 * Android uses *reader mode* (not foreground dispatch): foreground dispatch makes
 * the system discover the tag (the phone vibrates) but does not reliably deliver
 * the UID of NDEF-less cards (e.g. Mifare Classic). Reader mode with
 * FLAG_READER_SKIP_NDEF_CHECK reads any tag's UID directly via a callback.
 */
import { Platform } from 'react-native';
import NfcManager, { NfcEvents, type TagEvent } from 'react-native-nfc-manager';

import { NFC_SCAN_HINT, TAG_DEBOUNCE_MS } from '../constants/nfc';
import type { NfcLogEntry, NfcStatus } from '../types';
import { formatTagId } from '../utils/uid';

/**
 * NfcAdapter reader-mode flags (android.nfc.NfcAdapter). Read NFC-A/B/F/V, skip
 * the NDEF check so UID-only cards are delivered, and suppress the platform
 * discovery sound (the app handles feedback itself).
 */
const ANDROID_READER_FLAGS =
  0x1 | // FLAG_READER_NFC_A
  0x2 | // FLAG_READER_NFC_B
  0x4 | // FLAG_READER_NFC_F
  0x8 | // FLAG_READER_NFC_V
  0x80 | // FLAG_READER_SKIP_NDEF_CHECK
  0x100; // FLAG_READER_NO_PLATFORM_SOUNDS

export interface NfcHandlers {
  onStatusChange: (status: NfcStatus) => void;
  onUid: (uid: string) => void;
  onError: (message: string) => void;
  onLog: (entry: NfcLogEntry) => void;
}

class NfcService {
  private started = false;
  private listening = false;
  private status: NfcStatus = 'idle';

  private lastUid: string | null = null;
  private lastUidAt = 0;

  private handlers: NfcHandlers = {
    onStatusChange: () => {},
    onUid: () => {},
    onError: () => {},
    onLog: () => {},
  };

  /** Initialises the native manager and wires tag-discovery callbacks. */
  async init(handlers: NfcHandlers): Promise<void> {
    this.handlers = handlers;
    try {
      const supported = await NfcManager.isSupported();
      this.log(`isSupported = ${supported}`);
      if (!supported) {
        this.setStatus('unsupported');
        return;
      }
      await NfcManager.start();
      this.started = true;
      this.log('native manager started');

      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent | null) => {
        this.log(`DiscoverTag id=${tag?.id ?? 'null'} tech=${tag?.techTypes?.join(',') ?? '—'}`, 'tag');
        const uid = tag?.id ? formatTagId(tag.id) : null;
        if (uid) {
          this.emitUid(uid);
        } else {
          this.log('tag had no id — nothing to read', 'error');
          this.handlers.onError('Kartu se nepodařilo přečíst (chybí UID)');
        }
      });
      // iOS closes the scan session after each read; reflect that in the status.
      NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
        this.log('SessionClosed');
        if (Platform.OS === 'ios' && this.listening) {
          this.listening = false;
          if (this.status === 'scanning') this.setStatus('idle');
        }
      });

      await this.refreshEnabled();
    } catch (e) {
      this.log(`init failed: ${errMsg(e)}`, 'error');
      this.setStatus('unsupported');
    }
  }

  destroy(): void {
    void this.stopScan();
    if (this.started) {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.setEventListener(NfcEvents.SessionClosed, null);
    }
  }

  getStatus(): NfcStatus {
    return this.status;
  }

  /** Pushes a free-form note into the event log (used for app-lifecycle events). */
  note(msg: string): void {
    this.log(msg);
  }

  /** Re-reads whether NFC is enabled in settings (Android) and updates status. */
  async refreshEnabled(): Promise<boolean> {
    if (!this.started) return false;
    let enabled = true;
    try {
      enabled = await NfcManager.isEnabled();
    } catch {
      enabled = false;
    }
    this.log(`isEnabled = ${enabled}`);
    if (!enabled) {
      this.listening = false;
      this.setStatus('disabled');
      return false;
    }
    if (this.status === 'disabled' || this.status === 'unsupported') this.setStatus('idle');
    return true;
  }

  /* ── Scan ───────────────────────────────────────────────── */

  /** Begins listening for tag taps. Resolves once the session is registered. */
  async startScan(): Promise<void> {
    if (!this.started) {
      this.handlers.onError('NFC není na tomto zařízení dostupné');
      return;
    }
    if (this.listening) {
      this.log('startScan ignored — already listening');
      return;
    }
    const enabled = await this.refreshEnabled();
    if (!enabled) {
      this.handlers.onError('Zapněte NFC v nastavení telefonu');
      return;
    }
    try {
      const options =
        Platform.OS === 'android'
          ? { isReaderModeEnabled: true, readerModeFlags: ANDROID_READER_FLAGS, readerModeDelay: 250 }
          : { alertMessage: NFC_SCAN_HINT };
      this.log(`registerTagEvent ${Platform.OS === 'android' ? `reader-mode flags=0x${ANDROID_READER_FLAGS.toString(16)}` : 'ios-session'}`);
      await NfcManager.registerTagEvent(options);
      this.listening = true;
      this.setStatus('scanning');
    } catch (e) {
      this.log(`registerTagEvent failed: ${errMsg(e)}`, 'error');
      this.handlers.onError('Spuštění NFC se nezdařilo');
    }
  }

  async stopScan(): Promise<void> {
    if (this.listening) {
      this.listening = false;
      this.log('unregisterTagEvent');
      try {
        await NfcManager.unregisterTagEvent();
      } catch {
        // session may already be closed
      }
    }
    if (this.status === 'scanning') this.setStatus('idle');
  }

  /** Auto-start listening on app launch when NFC is ready (mirrors BLE reconnect). */
  tryAutoStart(): void {
    if (!this.started) return;
    void (async () => {
      const enabled = await this.refreshEnabled();
      if (enabled && this.status === 'idle') await this.startScan();
    })();
  }

  /** Opens the system NFC settings screen (Android). No-op elsewhere. */
  async openSettings(): Promise<void> {
    if (Platform.OS !== 'android') return;
    try {
      await NfcManager.goToNfcSetting();
    } catch {
      // settings intent unavailable — nothing to do
    }
  }

  /* ── Internals ──────────────────────────────────────────── */

  private emitUid(uid: string): void {
    const now = Date.now();
    if (uid === this.lastUid && now - this.lastUidAt < TAG_DEBOUNCE_MS) {
      this.log(`debounced duplicate ${uid}`);
      return;
    }
    this.lastUid = uid;
    this.lastUidAt = now;
    this.log(`UID ${uid} → dispatch`, 'tag');
    this.handlers.onUid(uid);
  }

  private setStatus(status: NfcStatus): void {
    if (status !== this.status) this.log(`status → ${status}`);
    this.status = status;
    this.handlers.onStatusChange(status);
  }

  private log(msg: string, level: NfcLogEntry['level'] = 'info'): void {
    console.log(`[NFC] ${msg}`);
    this.handlers.onLog({ time: clockNow(), msg, level });
  }
}

function clockNow(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export const nfc = new NfcService();

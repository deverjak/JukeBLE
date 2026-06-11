/**
 * BLE GATT profile of the JukeBLE reader (ESP32 + MFRC522).
 * Values must match the firmware — see docs/rfid-jukebox-architektura.md.
 */
export const BLE_DEVICE_NAME = 'RFID-Jukebox';

export const BLE_SERVICE_UUID = '6f0e0001-aa1b-4c6e-8a3d-1f2e3c4d5e6f';
export const BLE_UID_CHARACTERISTIC_UUID = '6f0e0002-aa1b-4c6e-8a3d-1f2e3c4d5e6f';

export const SCAN_TIMEOUT_MS = 12_000;
export const CONNECT_TIMEOUT_MS = 10_000;
/** Reconnect backoff after an unexpected disconnect; then wait for manual action. */
export const RECONNECT_DELAYS_MS = [1_000, 2_000, 5_000];
export const RSSI_POLL_MS = 8_000;

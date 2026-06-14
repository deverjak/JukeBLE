/**
 * NFC reader tuning for the JukeNFC app.
 *
 * Unlike the BLE variant there is no external reader and no GATT profile — the
 * phone's own NFC antenna reads tags directly, so the only knobs are how long a
 * single iOS scan session stays open and the debounce between repeated taps of
 * the same tag.
 */

/** Prompt shown on the iOS system scan sheet (Android discovers tags silently). */
export const NFC_SCAN_HINT = 'Přiložte kartu k telefonu';

/** Ignore the same UID re-fired within this window (Android can deliver bursts). */
export const TAG_DEBOUNCE_MS = 800;

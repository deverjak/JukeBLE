/**
 * Formats an NFC tag id into the hex UID string used across the app,
 * e.g. "04a1b2c3" → "04:A1:B2:C3".
 *
 * react-native-nfc-manager reports `tag.id` as a lowercase, separator-less hex
 * string on Android; this normalises it to the colon-separated uppercase form
 * the rest of the app (and the BLE variant) uses. Works for 4–10 byte UIDs.
 */
export function formatTagId(id: string): string {
  const hex = id.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  if (hex.length === 0) return '';
  return (hex.match(/.{1,2}/g) ?? []).join(':');
}

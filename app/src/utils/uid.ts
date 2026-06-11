import { Buffer } from 'buffer';

/**
 * Decodes the raw UID payload of a BLE notification (base64-encoded bytes)
 * into a hex string like "C0:7C:3C:52". Works for 4–10 byte UIDs.
 */
export function decodeUidBase64(base64Value: string): string {
  const bytes = Buffer.from(base64Value, 'base64');
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(':');
}

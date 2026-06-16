import * as InAppUpdates from 'expo-in-app-updates';
import { Platform } from 'react-native';

/**
 * Enforces a hard, blocking update via Google Play In-App Updates (immediate flow).
 *
 * This app ships no OTA updates, so a fresh build on the Play Store is the only way
 * users receive changes. The immediate flow shows a full-screen Play overlay the user
 * cannot dismiss until the update is installed — exactly the "natvrdo" behaviour we want
 * for infrequent releases.
 *
 * No-ops on non-Android platforms and in dev. On builds not installed from Play
 * (sideloaded / internal-distribution APKs) the Play check throws; we swallow it so the
 * app keeps running.
 */
export async function enforceUpdate(): Promise<void> {
  if (Platform.OS !== 'android' || __DEV__) return;
  try {
    await InAppUpdates.checkAndStartUpdate(true);
  } catch {
    // Not a Play install or Play services unavailable — nothing to enforce.
  }
}

/** Tiny key-value settings on top of expo-sqlite/kv-store. */
import Storage from 'expo-sqlite/kv-store';

import type { ThemeName } from '../theme/tokens';

const DEVICE_KEY = 'jukeble.pairedDevice';
const THEME_KEY = 'jukeble.theme';

export interface SavedDevice {
  id: string;
  name: string | null;
}

export function getSavedDevice(): SavedDevice | null {
  const raw = Storage.getItemSync(DEVICE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedDevice;
  } catch {
    return null;
  }
}

export function setSavedDevice(device: SavedDevice): void {
  Storage.setItemSync(DEVICE_KEY, JSON.stringify(device));
}

export function clearSavedDevice(): void {
  Storage.removeItemSync(DEVICE_KEY);
}

export function getSavedTheme(): ThemeName | null {
  const raw = Storage.getItemSync(THEME_KEY);
  return raw === 'dark' || raw === 'light' ? raw : null;
}

export function setSavedTheme(theme: ThemeName): void {
  Storage.setItemSync(THEME_KEY, theme);
}

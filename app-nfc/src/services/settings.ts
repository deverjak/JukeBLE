/** Tiny key-value settings on top of expo-sqlite/kv-store. */
import Storage from 'expo-sqlite/kv-store';

import type { ThemeName } from '../theme/tokens';

const THEME_KEY = 'jukenfc.theme';

export function getSavedTheme(): ThemeName | null {
  const raw = Storage.getItemSync(THEME_KEY);
  return raw === 'dark' || raw === 'light' ? raw : null;
}

export function setSavedTheme(theme: ThemeName): void {
  Storage.setItemSync(THEME_KEY, theme);
}

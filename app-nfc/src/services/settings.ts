/** Tiny key-value settings on top of expo-sqlite/kv-store. */
import Storage from 'expo-sqlite/kv-store';

import type { ThemeName } from '../theme/tokens';

const THEME_KEY = 'jukenfc.theme';
const LANG_KEY = 'jukenfc.lang';
const KEEP_AWAKE_KEY = 'jukenfc.keepAwake';
const AUTO_RESUME_KEY = 'jukenfc.autoResume';

export function getSavedTheme(): ThemeName | null {
  const raw = Storage.getItemSync(THEME_KEY);
  return raw === 'dark' || raw === 'light' ? raw : null;
}

export function setSavedTheme(theme: ThemeName): void {
  Storage.setItemSync(THEME_KEY, theme);
}

export function getSavedLang(): 'cs' | 'en' | null {
  const raw = Storage.getItemSync(LANG_KEY);
  return raw === 'cs' || raw === 'en' ? raw : null;
}

export function setSavedLang(lang: 'cs' | 'en'): void {
  Storage.setItemSync(LANG_KEY, lang);
}

export function getSavedFlag(key: 'keepAwake' | 'autoResume', fallback: boolean): boolean {
  const raw = Storage.getItemSync(key === 'keepAwake' ? KEEP_AWAKE_KEY : AUTO_RESUME_KEY);
  return raw === null ? fallback : raw === '1';
}

export function setSavedFlag(key: 'keepAwake' | 'autoResume', value: boolean): void {
  Storage.setItemSync(key === 'keepAwake' ? KEEP_AWAKE_KEY : AUTO_RESUME_KEY, value ? '1' : '0');
}

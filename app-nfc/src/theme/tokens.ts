/**
 * Design tokens ported from design-prototype/styles.css
 * (Chytře.digital tokens, dark-first with a tuned light inversion).
 */
export type ThemeName = 'dark' | 'light';

export interface Tokens {
  bg0: string;
  bg1: string;
  bg2: string;
  bg3: string;
  fg0: string;
  fg1: string;
  fg2: string;
  fg3: string;
  fg4: string;
  line1: string;
  line2: string;
  line3: string;
  accent: string;
  accentPress: string;
  accentSoft: string;
  accentInk: string;
  warn: string;
  warnSoft: string;
  error: string;
  errorSoft: string;
  scrim: string;
}

export const darkTokens: Tokens = {
  bg0: '#000000',
  bg1: '#0A0A0A',
  bg2: '#141414',
  bg3: '#1F1F1F',
  fg0: '#FFFFFF',
  fg1: '#CCCCCC',
  fg2: '#999999',
  fg3: '#666666',
  fg4: '#404040',
  line1: 'rgba(255,255,255,0.10)',
  line2: 'rgba(255,255,255,0.20)',
  line3: 'rgba(255,255,255,0.06)',
  accent: '#00E676',
  accentPress: '#00CC6A',
  accentSoft: '#07301C',
  accentInk: '#00E676',
  warn: '#F5A524',
  warnSoft: '#2A2207',
  error: '#FF5C5C',
  errorSoft: '#2A1414',
  scrim: 'rgba(0,0,0,0.55)',
};

export const lightTokens: Tokens = {
  bg0: '#FFFFFF',
  bg1: '#FBFBFA',
  bg2: '#F3F3F1',
  bg3: '#EAEAE7',
  fg0: '#0A0A0A',
  fg1: '#3A3A3A',
  fg2: '#6E6E6E',
  fg3: '#9A9A9A',
  fg4: '#C6C6C4',
  line1: 'rgba(0,0,0,0.12)',
  line2: 'rgba(0,0,0,0.24)',
  line3: 'rgba(0,0,0,0.06)',
  accent: '#00C264',
  accentPress: '#00A856',
  accentSoft: '#E2F8EC',
  accentInk: '#009A52',
  warn: '#C77800',
  warnSoft: '#FBF1DD',
  error: '#E03B3B',
  errorSoft: '#FBE6E6',
  scrim: 'rgba(0,0,0,0.55)',
};

export const fonts = {
  sans: {
    regular: 'Geist_400Regular',
    medium: 'Geist_500Medium',
    semibold: 'Geist_600SemiBold',
    bold: 'Geist_700Bold',
  },
  mono: {
    regular: 'GeistMono_400Regular',
    medium: 'GeistMono_500Medium',
    semibold: 'GeistMono_600SemiBold',
  },
};

/** rgba() from a #RRGGBB token — replacement for CSS color-mix(). */
export function alpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

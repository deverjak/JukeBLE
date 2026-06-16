/**
 * Design tokens — ported from app-nfc-design/design system/tokens/*.css
 * "Sound-card" identity: bright candy tones over a plum-dark (app) / warm-cream
 * (light) surface, friendly rounded type, soft tinted shadows.
 */
import { Platform } from 'react-native';

export type ThemeName = 'dark' | 'light';

export interface Tokens {
  /** Surfaces */
  bgPage: string;
  bgSubtle: string;
  surfaceCard: string;
  surfaceRaised: string;
  surfaceSunken: string;
  /** Text */
  textStrong: string;
  textBody: string;
  textMuted: string;
  textFaint: string;
  textOnBrand: string;
  /** Hairlines */
  borderSoft: string;
  borderMid: string;
  borderStrong: string;
  /** Brand (grape) */
  brand: string;
  brandStrong: string;
  brandSoft: string;
  focusRing: string;
  /** Semantic (theme-independent hues) */
  success: string;
  warning: string;
  danger: string;
  dangerStrong: string;
  info: string;
  /** NFC reader status dots */
  statusListening: string;
  statusReady: string;
  statusDisabled: string;
  statusUnsupported: string;
  /** Overlay */
  scrim: string;
}

export const darkTokens: Tokens = {
  bgPage: '#15121f',
  bgSubtle: '#1c1830',
  surfaceCard: '#241e3a',
  surfaceRaised: '#2e2748',
  surfaceSunken: '#1c1830',

  textStrong: '#f4f0fb',
  textBody: '#d8d0ea',
  textMuted: '#9a90b6',
  textFaint: '#6c6388',
  textOnBrand: '#ffffff',

  borderSoft: 'rgba(255,255,255,0.07)',
  borderMid: 'rgba(255,255,255,0.12)',
  borderStrong: 'rgba(255,255,255,0.22)',

  brand: '#8b6bf8', // grape-400 (brighter on dark)
  brandStrong: '#ab93ff', // grape-300
  brandSoft: 'rgba(108,76,241,0.22)',
  focusRing: '#ab93ff',

  success: '#1fc8a9',
  warning: '#ffc23d',
  danger: '#ff4d6d',
  dangerStrong: '#e23357',
  info: '#3da5ff',

  statusListening: '#1fc8a9',
  statusReady: '#3da5ff',
  statusDisabled: '#9b90b0',
  statusUnsupported: '#ff4d6d',

  scrim: 'rgba(10,8,18,0.62)',
};

export const lightTokens: Tokens = {
  bgPage: '#fff8ee', // cream
  bgSubtle: '#f6ecdd', // sand-100
  surfaceCard: '#fffdf8', // paper
  surfaceRaised: '#ffffff',
  surfaceSunken: '#f6ecdd',

  textStrong: '#221b33', // ink-900
  textBody: '#463a5e', // ink-700
  textMuted: '#6e6286', // ink-500
  textFaint: '#9b90b0', // ink-300
  textOnBrand: '#ffffff',

  borderSoft: 'rgba(34,27,51,0.08)',
  borderMid: 'rgba(34,27,51,0.14)',
  borderStrong: 'rgba(34,27,51,0.24)',

  brand: '#6c4cf1', // grape-500
  brandStrong: '#5639d6', // grape-600
  brandSoft: '#e6ddff', // grape-100
  focusRing: '#8b6bf8',

  success: '#1fc8a9',
  warning: '#ffc23d',
  danger: '#ff4d6d',
  dangerStrong: '#e23357',
  info: '#3da5ff',

  statusListening: '#1fc8a9',
  statusReady: '#3da5ff',
  statusDisabled: '#9b90b0',
  statusUnsupported: '#ff4d6d',

  scrim: 'rgba(34,27,51,0.45)',
};

/* ── Sound-card tones ─────────────────────────────────────────
   Six candy hues, identical in both themes. `edge` is the darker
   bottom-edge for the tactile button; `fg` is the text/icon color
   that sits on the 500 fill. */
export type ToneName = 'grape' | 'tangerine' | 'sunshine' | 'mint' | 'sky' | 'bubblegum';

export interface ToneScale {
  s300: string;
  s400: string;
  s500: string;
  s600: string;
  edge: string;
  fg: string;
}

export const tones: Record<ToneName, ToneScale> = {
  grape: { s300: '#ab93ff', s400: '#8b6bf8', s500: '#6c4cf1', s600: '#5639d6', edge: '#432aad', fg: '#ffffff' },
  tangerine: { s300: '#ffc1a0', s400: '#ff9b62', s500: '#ff7a3d', s600: '#e85f22', edge: '#e85f22', fg: '#ffffff' },
  sunshine: { s300: '#ffe39a', s400: '#ffd45c', s500: '#ffc23d', s600: '#eaa514', edge: '#eaa514', fg: '#4a3208' },
  mint: { s300: '#8af0dc', s400: '#41dcc0', s500: '#1fc8a9', s600: '#11a78c', edge: '#11a78c', fg: '#10342c' },
  sky: { s300: '#a8d6ff', s400: '#6bbcff', s500: '#3da5ff', s600: '#1f84e0', edge: '#1f84e0', fg: '#ffffff' },
  bubblegum: { s300: '#ffb6da', s400: '#ff8cc4', s500: '#ff6fb5', s600: '#e84a98', edge: '#e84a98', fg: '#5a113a' },
};

export const TONE_NAMES: ToneName[] = ['grape', 'tangerine', 'sunshine', 'mint', 'sky', 'bubblegum'];

/** Danger as a button tone (matches the DS Button `danger` entry). */
export const dangerTone: ToneScale = {
  s300: '#ffd9e0',
  s400: '#ff7d96',
  s500: '#ff4d6d',
  s600: '#e23357',
  edge: '#e23357',
  fg: '#ffffff',
};

/* ── Radii / motion ───────────────────────────────────────── */
export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 38,
  xxxl: 52,
  pill: 999,
  card: 28,
};

export const motion = {
  durFast: 120,
  durBase: 220,
  durSlow: 380,
  /** react-native-reanimated cubic-bezier args */
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  easeSpring: [0.34, 1.56, 0.64, 1] as const,
};

/* ── Soft tinted shadow (plum ink) ────────────────────────────
   Android leans on elevation; iOS on shadow*. */
export function shadow(level: 'sm' | 'md' | 'lg' | 'xl' = 'md') {
  const map = {
    sm: { elevation: 2, radius: 8, y: 2, opacity: 0.1 },
    md: { elevation: 5, radius: 16, y: 8, opacity: 0.12 },
    lg: { elevation: 10, radius: 28, y: 16, opacity: 0.16 },
    xl: { elevation: 16, radius: 40, y: 24, opacity: 0.2 },
  }[level];
  return Platform.select({
    android: { elevation: map.elevation },
    default: {
      shadowColor: '#221b33',
      shadowOffset: { width: 0, height: map.y },
      shadowOpacity: map.opacity,
      shadowRadius: map.radius,
    },
  });
}

export const fonts = {
  display: {
    regular: 'Baloo2_400Regular',
    medium: 'Baloo2_500Medium',
    semibold: 'Baloo2_600SemiBold',
    bold: 'Baloo2_700Bold',
    extra: 'Baloo2_800ExtraBold',
  },
  body: {
    regular: 'Nunito_400Regular',
    medium: 'Nunito_500Medium',
    semibold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extra: 'Nunito_800ExtraBold',
    black: 'Nunito_900Black',
  },
  mono: {
    regular: 'DMMono_400Regular',
    medium: 'DMMono_500Medium',
  },
};

/** rgba() from a #RRGGBB token — replacement for CSS color-mix(). */
export function alpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

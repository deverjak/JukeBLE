/**
 * Deterministic per-card visuals — derives a colorful tone + category icon
 * from the card UID so every card gets a stable, distinct look without storing
 * anything. Same UID always yields the same tone/icon.
 */
import type { IconName } from '../components/Icon';
import { TONE_NAMES, type ToneName } from '../theme/tokens';

const CARD_ICONS: IconName[] = ['cat', 'drum', 'bird', 'sparkles', 'car', 'bell', 'hand', 'zap', 'music-2'];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function cardVisual(uid: string): { tone: ToneName; icon: IconName } {
  const h = hash(uid);
  return {
    tone: TONE_NAMES[h % TONE_NAMES.length],
    icon: CARD_ICONS[Math.floor(h / TONE_NAMES.length) % CARD_ICONS.length],
  };
}

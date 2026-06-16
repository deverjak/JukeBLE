import { Text, View } from 'react-native';

import { useT } from '../i18n';
import { useTheme } from '../theme/ThemeContext';
import { fonts, radii, shadow, tones } from '../theme/tokens';
import { Icon } from './Icon';
import { RadarRings } from './ui/anim';

/** Dashed "tap a card" prompt shown when nothing is playing / in registration mode. */
export function TapPrompt({ active, mode }: { active: boolean; mode: 'play' | 'registration' }) {
  const { tokens } = useTheme();
  const t = useT();
  const reg = mode === 'registration';
  const tone = reg ? tones.grape : tones.mint;

  return (
    <View
      style={{
        borderRadius: radii.xl,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: tokens.borderMid,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: tokens.surfaceCard,
        opacity: active ? 1 : 0.6,
        overflow: 'hidden',
      }}>
      <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
        {active && <RadarRings size={64} delays={[0, 600, 1200]} color={tone.s400} />}
        <View
          style={[
            {
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? tone.s500 : tokens.surfaceSunken,
            },
            active && shadow('md'),
          ]}>
          <Icon name="nfc" size={32} color={active ? '#fff' : tokens.textFaint} />
        </View>
      </View>
      <Text style={{ fontFamily: fonts.display.semibold, fontSize: 19, color: tokens.textStrong }}>
        {reg ? t.tapPrompt.registerTitle : t.tapPrompt.playTitle}
      </Text>
      <Text
        style={{
          fontFamily: fonts.body.regular,
          fontSize: 14,
          color: tokens.textMuted,
          marginTop: 8,
          maxWidth: 260,
          lineHeight: 21,
          textAlign: 'center',
        }}>
        {reg ? t.tapPrompt.registerBody : t.tapPrompt.playBody}
      </Text>
    </View>
  );
}

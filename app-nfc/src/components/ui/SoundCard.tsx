import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { fonts, radii, shadow, tones, type ToneName } from '../../theme/tokens';
import { Icon, type IconName } from '../Icon';
import { EqBars } from './anim';

/** A card → sound mapping as a tappable colored tile (Player grid). */
export function SoundCard({
  name,
  sound,
  tone,
  icon,
  playing,
  onPress,
}: {
  name: string;
  sound: string;
  tone: ToneName;
  icon: IconName;
  playing?: boolean;
  onPress?: () => void;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          gap: 12,
          padding: 14,
          backgroundColor: tokens.surfaceCard,
          borderRadius: radii.xl,
          borderWidth: playing ? 3 : 1,
          borderColor: playing ? tones[tone].s500 : tokens.borderSoft,
        },
        shadow('sm'),
        pressed && { transform: [{ scale: 0.96 }] },
      ]}>
      <View
        style={{
          aspectRatio: 1,
          borderRadius: radii.lg,
          backgroundColor: tones[tone].s500,
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.12)',
        }}>
        {playing ? <EqBars playing color="#fff" size={26} /> : <Icon name={icon} size={46} color="#fff" />}
      </View>
      <View style={{ gap: 2, paddingHorizontal: 4, paddingBottom: 4 }}>
        <Text numberOfLines={1} style={{ fontFamily: fonts.display.semibold, fontSize: 18, color: tokens.textStrong }}>
          {name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Icon name="music-2" size={13} color={tokens.textMuted} />
          <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.body.semibold, fontSize: 13, color: tokens.textMuted }}>
            {sound}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

import { useEffect } from 'react';
import { Animated, Easing, Pressable, Text, useAnimatedValue } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { fonts, radii, tones, type ToneName } from '../../theme/tokens';

const W = 52;
const H = 30;
const KN = 24;

export function Switch({
  checked,
  onChange,
  tone = 'mint',
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  tone?: ToneName;
  label?: string;
  disabled?: boolean;
}) {
  const { tokens } = useTheme();
  const anim = useAnimatedValue(checked ? 1 : 0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: checked ? 1 : 0,
      duration: 220,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      useNativeDriver: false,
    }).start();
  }, [checked, anim]);

  const track = (
    <Pressable
      role="switch"
      aria-checked={checked}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={{ opacity: disabled ? 0.5 : 1 }}>
      <Animated.View
        style={{
          width: W,
          height: H,
          borderRadius: radii.pill,
          padding: 3,
          justifyContent: 'center',
          backgroundColor: anim.interpolate({ inputRange: [0, 1], outputRange: [tokens.borderStrong, tones[tone].s500] }),
        }}>
        <Animated.View
          style={{
            width: KN,
            height: KN,
            borderRadius: KN / 2,
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px rgba(0,0,0,0.25)',
            transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, W - KN - 6] }) }],
          }}
        />
      </Animated.View>
    </Pressable>
  );

  if (!label) return track;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {track}
      <Text style={{ flex: 1, fontFamily: fonts.body.semibold, fontSize: 15, color: tokens.textStrong }}>{label}</Text>
    </Pressable>
  );
}

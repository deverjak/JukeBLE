import { useEffect, useState } from 'react';
import { Animated, Easing, type LayoutChangeEvent, Pressable, Text, View, useAnimatedValue } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { fonts, radii, tones } from '../../theme/tokens';
import { Icon } from '../Icon';
import type { Mode } from '../../types';

const META: Record<Mode, { tone: 'grape' | 'mint'; icon: 'plus' | 'play' }> = {
  registration: { tone: 'grape', icon: 'plus' },
  play: { tone: 'mint', icon: 'play' },
};

export function ModeToggle({
  mode,
  onChange,
  labels,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
  labels: { registration: string; play: string };
}) {
  const { tokens } = useTheme();
  const order: Mode[] = ['registration', 'play'];
  const idx = order.indexOf(mode);
  const anim = useAnimatedValue(idx);
  const [w, setW] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: idx,
      duration: 220,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
      useNativeDriver: true,
    }).start();
  }, [idx, anim]);

  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);
  const half = (w - 10) / 2; // minus padding 5+5

  return (
    <View
      onLayout={onLayout}
      style={{
        flexDirection: 'row',
        padding: 5,
        backgroundColor: tokens.surfaceSunken,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: tokens.borderSoft,
      }}>
      {w > 0 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 5,
            bottom: 5,
            left: 5,
            width: half,
            borderRadius: radii.pill,
            backgroundColor: tones[META[mode].tone].s500,
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, half] }) }],
          }}
        />
      )}
      {order.map((m) => {
        const on = m === mode;
        return (
          <Pressable
            key={m}
            onPress={() => onChange(m)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 11,
              borderRadius: radii.pill,
            }}>
            <Icon name={META[m].icon} size={18} color={on ? '#fff' : tokens.textMuted} />
            <Text style={{ fontFamily: fonts.display.semibold, fontSize: 15, color: on ? '#fff' : tokens.textMuted }}>
              {labels[m]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';
import { Icon, type IconName } from '../Icon';

export interface SegOption<T extends string> {
  value: T;
  label: string;
  icon: IconName;
  /** Active text uses the accent color (play mode highlight). */
  accent?: boolean;
}

export function Seg<T extends string>({
  options,
  value,
  onChange,
}: {
  options: SegOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: tokens.bg2,
        borderWidth: 1,
        borderColor: tokens.line1,
        borderRadius: 12,
        padding: 4,
        gap: 4,
      }}>
      {options.map((opt) => {
        const active = value === opt.value;
        const color = active ? (opt.accent ? tokens.accentInk : tokens.fg0) : tokens.fg2;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 11,
              paddingHorizontal: 8,
              borderRadius: 9,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              backgroundColor: active ? tokens.bg0 : 'transparent',
              borderWidth: 1,
              borderColor: active ? tokens.line1 : 'transparent',
            }}>
            <Icon name={opt.icon} size={opt.icon === 'play' ? 13 : 15} color={color} />
            <Text
              style={{
                fontFamily: fonts.mono.medium,
                fontSize: 11,
                letterSpacing: 0.88,
                textTransform: 'uppercase',
                color,
              }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

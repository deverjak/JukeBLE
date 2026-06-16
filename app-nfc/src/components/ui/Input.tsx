import { useState } from 'react';
import { Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { alpha, fonts, radii } from '../../theme/tokens';
import { Icon, type IconName } from '../Icon';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  iconLeft?: IconName;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Input({ value, onChangeText, placeholder, label, iconLeft, autoFocus, style }: InputProps) {
  const { tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ gap: 7 }, style]}>
      {label && (
        <Text style={{ fontFamily: fonts.body.bold, fontSize: 14, color: tokens.textBody }}>{label}</Text>
      )}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: tokens.surfaceRaised,
            borderWidth: 2,
            borderColor: focused ? tokens.brand : tokens.borderMid,
            borderRadius: radii.lg,
            paddingHorizontal: 16,
          },
          focused && { boxShadow: `0 0 0 3px ${alpha(tokens.focusRing, 0.4)}` },
        ]}>
        {iconLeft && <Icon name={iconLeft} size={18} color={tokens.textMuted} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tokens.textFaint}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            paddingVertical: 13,
            color: tokens.textStrong,
            fontFamily: fonts.body.semibold,
            fontSize: 16,
          }}
        />
      </View>
    </View>
  );
}

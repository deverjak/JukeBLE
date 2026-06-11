import { useState } from 'react';
import { TextInput, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { alpha, fonts } from '../../theme/tokens';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Input({ value, onChangeText, placeholder, autoFocus, style }: InputProps) {
  const { tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={tokens.fg3}
      autoFocus={autoFocus}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        {
          backgroundColor: tokens.bg2,
          borderWidth: 1,
          borderColor: focused ? tokens.accent : tokens.line1,
          borderRadius: 9,
          paddingVertical: 13,
          paddingHorizontal: 14,
          color: tokens.fg0,
          fontFamily: fonts.sans.regular,
          fontSize: 16,
        },
        focused && {
          shadowColor: tokens.accent,
          shadowOpacity: 0.22,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 0 },
          boxShadow: `0 0 0 3px ${alpha(tokens.accent, 0.22)}`,
        },
        style,
      ]}
    />
  );
}

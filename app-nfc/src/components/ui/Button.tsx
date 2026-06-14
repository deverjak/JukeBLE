import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';
import { Icon, type IconName } from '../Icon';
import { Spinner } from './anim';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', icon, disabled, loading, small, style }: ButtonProps) {
  const { tokens } = useTheme();

  const palette = {
    primary: { bg: tokens.accent, bgPressed: tokens.accentPress, fg: '#000000', border: 'transparent' },
    secondary: { bg: 'transparent', bgPressed: tokens.bg2, fg: tokens.fg0, border: tokens.line2 },
    ghost: { bg: 'transparent', bgPressed: tokens.bg2, fg: tokens.fg1, border: 'transparent' },
    danger: { bg: 'transparent', bgPressed: tokens.errorSoft, fg: tokens.error, border: tokens.line1 },
  }[variant];

  const inactive = disabled || loading;
  const fg = disabled ? tokens.fg3 : palette.fg;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        {
          borderRadius: 10,
          borderWidth: 1,
          borderColor: disabled ? 'transparent' : palette.border,
          backgroundColor: disabled ? tokens.bg3 : pressed ? palette.bgPressed : palette.bg,
          paddingVertical: small ? 8 : 13,
          paddingHorizontal: small ? 12 : 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        },
        pressed && !inactive && { transform: [{ translateY: 1 }] },
        style,
      ]}>
      {loading ? <Spinner size={small ? 15 : 17} color={fg} /> : icon ? <Icon name={icon} size={small ? 15 : 17} color={fg} /> : null}
      <Text style={{ fontFamily: fonts.sans.medium, fontSize: small ? 13 : 15, color: fg }}>{label}</Text>
    </Pressable>
  );
}

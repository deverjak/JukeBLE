import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { dangerTone, fonts, radii, tones, type ToneName } from '../../theme/tokens';
import { Icon, type IconName } from '../Icon';
import { Spinner } from './anim';

/** primary = solid candy face on a tactile bottom edge; ghost = outline; soft = tinted. */
type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, { fontSize: number; padV: number; padH: number; radius: number; gap: number; edge: number }> = {
  sm: { fontSize: 14, padV: 9, padH: 16, radius: radii.md, gap: 6, edge: 3 },
  md: { fontSize: 16, padV: 14, padH: 22, radius: radii.lg, gap: 8, edge: 4 },
  lg: { fontSize: 18, padV: 17, padH: 30, radius: radii.xl, gap: 10, edge: 5 },
};

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  tone?: ToneName;
  icon?: IconName;
  size?: Size;
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  /** legacy alias for size="sm" */
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  tone = 'grape',
  icon,
  size,
  block,
  disabled,
  loading,
  small,
  style,
}: ButtonProps) {
  const { tokens } = useTheme();
  const s = SIZES[size ?? (small ? 'sm' : 'md')];

  const solidTone = variant === 'danger' ? dangerTone : tones[tone];
  const isSolid = variant === 'primary' || variant === 'danger';
  const isGhost = variant === 'ghost' || variant === 'secondary';

  const palette = isSolid
    ? { bg: solidTone.s500, fg: solidTone.fg, edge: solidTone.edge }
    : isGhost
      ? { bg: 'transparent', fg: tokens.textStrong, edge: null }
      : { bg: tokens.brandSoft, fg: tokens.brandStrong, edge: null };

  const disabledNow = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabledNow}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignSelf: block ? 'stretch' : 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
          gap: s.gap,
          paddingVertical: s.padV,
          paddingHorizontal: s.padH,
          borderRadius: s.radius,
          backgroundColor: palette.bg,
          borderWidth: isGhost ? 2 : 0,
          borderColor: tokens.borderMid,
          opacity: disabledNow ? 0.5 : 1,
          boxShadow: palette.edge && !pressed ? `0 ${s.edge}px 0 ${palette.edge}` : palette.edge ? `0 1px 0 ${palette.edge}` : undefined,
          transform: pressed && palette.edge ? [{ translateY: s.edge - 1 }] : pressed ? [{ scale: 0.98 }] : undefined,
        },
        style,
      ]}>
      {loading ? (
        <Spinner size={s.fontSize} color={palette.fg} />
      ) : (
        icon && <Icon name={icon} size={s.fontSize + 2} color={palette.fg} />
      )}
      <Text style={{ fontFamily: fonts.display.semibold, fontSize: s.fontSize, letterSpacing: -0.2, color: palette.fg }}>
        {label}
      </Text>
    </Pressable>
  );
}

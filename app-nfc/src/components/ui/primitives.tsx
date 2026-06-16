import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { alpha, fonts, radii, shadow, tones, type ToneName } from '../../theme/tokens';
import { Icon, type IconName } from '../Icon';

/* ── Uppercase mono section label ─────────────────────────── */
export function SectionLabel({
  children,
  right,
  style,
}: {
  children: string;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { tokens } = useTheme();
  return (
    <View style={[styles.sectionRow, style]}>
      <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: tokens.textMuted }}>
        {children}
      </Text>
      {right}
    </View>
  );
}

/* ── Mono key/value console row ───────────────────────────── */
export function ConsoleRow({ k, children, first }: { k: string; children: React.ReactNode; first?: boolean }) {
  const { tokens } = useTheme();
  return (
    <View style={[styles.consoleRow, !first && { borderTopWidth: 1, borderTopColor: tokens.borderSoft }]}>
      <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11.5, letterSpacing: 0.6, textTransform: 'uppercase', color: tokens.textFaint }}>{k}</Text>
      <View style={styles.consoleValue}>{children}</View>
    </View>
  );
}

export function ConsoleValue({ color, children }: { color?: string; children: React.ReactNode }) {
  const { tokens } = useTheme();
  return (
    <Text numberOfLines={1} style={{ fontFamily: fonts.mono.regular, fontSize: 13, color: color ?? tokens.textBody }}>
      {children}
    </Text>
  );
}

/* ── Surface card ─────────────────────────────────────────── */
type Pad = 'none' | 'sm' | 'md' | 'lg';
const PADS: Record<Pad, number> = { none: 0, sm: 16, md: 20, lg: 24 };

export function Card({
  style,
  children,
  pad = 'none',
  radius = radii.lg,
  accent,
  raised,
}: {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  pad?: Pad;
  radius?: number;
  accent?: ToneName;
  raised?: boolean;
}) {
  const { tokens } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: raised ? tokens.surfaceRaised : tokens.surfaceCard,
          borderWidth: 1,
          borderColor: tokens.borderSoft,
          borderRadius: radius,
          padding: PADS[pad],
          overflow: 'hidden',
        },
        shadow('md'),
        style,
      ]}>
      {accent && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: tones[accent].s500 }} />
      )}
      {children}
    </View>
  );
}

/* ── Badge — soft tinted or solid pill ────────────────────── */
export type BadgeTone = ToneName | 'danger';

export function Badge({
  tone = 'grape',
  solid = false,
  dot = false,
  children,
  style,
}: {
  tone?: BadgeTone;
  solid?: boolean;
  dot?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { tokens } = useTheme();
  const scale = tone === 'danger' ? { s500: tokens.danger, s600: tokens.dangerStrong, s300: alpha(tokens.danger, 0.22) } : tones[tone];
  const fg = solid ? '#fff' : tone === 'danger' ? tokens.danger : scale.s600;
  const bg = solid ? scale.s500 : tone === 'danger' ? alpha(tokens.danger, 0.16) : tones[tone].s300;
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {dot && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: solid ? '#fff' : scale.s500 }} />}
      <Text numberOfLines={1} style={{ fontFamily: fonts.body.bold, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: fg }}>
        {children}
      </Text>
    </View>
  );
}

/* ── Round icon button ────────────────────────────────────── */
const IB_SIZES = { sm: 36, md: 44, lg: 56 };

export function IconButton({
  name,
  size = 19,
  onPress,
  color,
  style,
  accessibilityLabel,
  variant = 'ghost',
  tone = 'grape',
  dim = 'md',
}: {
  name: IconName;
  size?: number;
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  variant?: 'solid' | 'soft' | 'ghost';
  tone?: ToneName;
  dim?: keyof typeof IB_SIZES;
}) {
  const { tokens } = useTheme();
  const d = IB_SIZES[dim];
  const variants = {
    solid: { bg: tones[tone].s500, fg: '#fff', border: 'transparent' },
    soft: { bg: tokens.brandSoft, fg: tokens.brandStrong, border: 'transparent' },
    ghost: { bg: 'transparent', fg: color ?? tokens.textBody, border: tokens.borderMid },
  }[variant];
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => [
        {
          width: d,
          height: d,
          borderRadius: radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: variants.bg,
          borderWidth: variant === 'ghost' ? 2 : 0,
          borderColor: variants.border,
        },
        pressed && { transform: [{ scale: 0.9 }] },
        style,
      ]}>
      <Icon name={name} size={size} color={color ?? variants.fg} />
    </Pressable>
  );
}

/* ── Radio dot ────────────────────────────────────────────── */
export function Radio({ on }: { on: boolean }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: on ? tokens.brand : tokens.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {on && <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: tokens.brand }} />}
    </View>
  );
}

/* ── Empty state — white-on-color rounded tile ────────────── */
export function EmptyState({
  icon,
  title,
  body,
  action,
  tone = 'grape',
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: React.ReactNode;
  tone?: ToneName;
}) {
  const { tokens } = useTheme();
  return (
    <View style={styles.empty}>
      <View
        style={[
          {
            width: 72,
            height: 72,
            borderRadius: radii.xl,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tones[tone].s500,
            marginBottom: 18,
          },
          shadow('md'),
        ]}>
        <Icon name={icon} size={32} color="#fff" />
      </View>
      <Text style={{ fontFamily: fonts.display.semibold, fontSize: 20, color: tokens.textStrong }}>{title}</Text>
      <Text
        style={{
          fontFamily: fonts.body.regular,
          fontSize: 15,
          color: tokens.textMuted,
          marginTop: 8,
          maxWidth: 280,
          lineHeight: 22,
          textAlign: 'center',
        }}>
        {body}
      </Text>
      {action && <View style={{ marginTop: 20 }}>{action}</View>}
    </View>
  );
}

/* ── List row (border-top separated) ──────────────────────── */
export function Row({
  first,
  style,
  children,
  onPress,
  alignTop,
}: {
  first?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onPress?: () => void;
  alignTop?: boolean;
}) {
  const { tokens } = useTheme();
  const base: StyleProp<ViewStyle> = [
    styles.row,
    alignTop && { alignItems: 'flex-start' },
    !first && { borderTopWidth: 1, borderTopColor: tokens.borderSoft },
    style,
  ];
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { backgroundColor: tokens.surfaceSunken }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

export const monoText = (color: string, size = 11.5): TextStyle => ({
  fontFamily: fonts.mono.regular,
  fontSize: size,
  color,
});

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  consoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
  },
  consoleValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  empty: {
    paddingVertical: 54,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});

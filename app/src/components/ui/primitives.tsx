import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { alpha, fonts } from '../../theme/tokens';
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
      <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, letterSpacing: 0.88, textTransform: 'uppercase', color: tokens.fg2 }}>
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
    <View style={[styles.consoleRow, !first && { borderTopWidth: 1, borderTopColor: tokens.line3 }]}>
      <Text style={{ fontFamily: fonts.mono.regular, fontSize: 13, color: tokens.fg2, letterSpacing: 0.26 }}>{k}</Text>
      <View style={styles.consoleValue}>{children}</View>
    </View>
  );
}

export function ConsoleValue({ color, children }: { color?: string; children: React.ReactNode }) {
  const { tokens } = useTheme();
  return (
    <Text numberOfLines={1} style={{ fontFamily: fonts.mono.regular, fontSize: 13, color: color ?? tokens.fg0 }}>
      {children}
    </Text>
  );
}

/* ── Surface card ─────────────────────────────────────────── */
export function Card({ style, children }: { style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const { tokens } = useTheme();
  return (
    <View style={[{ backgroundColor: tokens.bg1, borderWidth: 1, borderColor: tokens.line1, borderRadius: 12 }, style]}>
      {children}
    </View>
  );
}

/* ── Badge ────────────────────────────────────────────────── */
export type BadgeVariant = 'default' | 'ok' | 'warn' | 'err';

export function Badge({
  variant = 'default',
  icon,
  children,
  style,
  textColor,
}: {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}) {
  const { tokens } = useTheme();
  const palette = {
    default: { color: tokens.fg2, border: tokens.line1, bg: 'transparent' },
    ok: { color: tokens.accentInk, border: alpha(tokens.accent, 0.32), bg: tokens.accentSoft },
    warn: { color: tokens.warn, border: alpha(tokens.warn, 0.3), bg: tokens.warnSoft },
    err: { color: tokens.error, border: alpha(tokens.error, 0.3), bg: tokens.errorSoft },
  }[variant];
  return (
    <View style={[styles.badge, { borderColor: palette.border, backgroundColor: palette.bg }, style]}>
      {icon}
      <Text
        numberOfLines={1}
        style={{
          fontFamily: fonts.mono.regular,
          fontSize: 10,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: textColor ?? palette.color,
        }}>
        {children}
      </Text>
    </View>
  );
}

/* ── Icon button ──────────────────────────────────────────── */
export function IconButton({
  name,
  size = 19,
  onPress,
  color,
  style,
  accessibilityLabel,
}: {
  name: IconName;
  size?: number;
  onPress?: () => void;
  color?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  const { tokens } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconBtn,
        pressed && { backgroundColor: tokens.bg2, transform: [{ scale: 0.94 }] },
        style,
      ]}>
      <Icon name={name} size={size} color={color ?? tokens.fg1} />
    </Pressable>
  );
}

/* ── Radio dot ────────────────────────────────────────────── */
export function Radio({ on }: { on: boolean }) {
  const { tokens } = useTheme();
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: on ? tokens.accent : tokens.line2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {on && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tokens.accent }} />}
    </View>
  );
}

/* ── Empty state ──────────────────────────────────────────── */
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const { tokens } = useTheme();
  return (
    <View style={styles.empty}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tokens.bg1,
          borderWidth: 1,
          borderColor: tokens.line1,
          marginBottom: 18,
        }}>
        <Icon name={icon} size={28} color={tokens.fg3} />
      </View>
      <Text style={{ fontFamily: fonts.sans.medium, fontSize: 17, color: tokens.fg0 }}>{title}</Text>
      <Text
        style={{
          fontFamily: fonts.sans.regular,
          fontSize: 13.5,
          color: tokens.fg2,
          marginTop: 8,
          maxWidth: 280,
          lineHeight: 20,
          textAlign: 'center',
        }}>
        {body}
      </Text>
      {action && <View style={{ marginTop: 18 }}>{action}</View>}
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
    !first && { borderTopWidth: 1, borderTopColor: tokens.line3 },
    style,
  ];
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { backgroundColor: tokens.bg2 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

export const monoText = (color: string, size = 11): TextStyle => ({
  fontFamily: fonts.mono.regular,
  fontSize: size,
  color,
});

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  consoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
    paddingHorizontal: 9,
    borderRadius: 5,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  empty: {
    paddingVertical: 52,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});

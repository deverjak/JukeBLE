import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useT } from '../../i18n';
import { useTheme } from '../../theme/ThemeContext';
import { fonts, radii } from '../../theme/tokens';
import type { NfcStatus as NfcStatusState } from '../../types';
import { LiveDot } from './anim';

/** Maps the app's NfcStatus to a status dot color + label/sub copy. */
export function NfcStatusRow({
  state,
  lastUid,
  onPress,
  style,
}: {
  state: NfcStatusState;
  lastUid?: string | null;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { tokens } = useTheme();
  const t = useT();

  const meta = {
    scanning: { color: tokens.statusListening, label: t.nfc.listening, sub: t.nfc.listeningSub, pulse: true },
    idle: { color: tokens.statusReady, label: t.nfc.ready, sub: t.nfc.readySub, pulse: false },
    disabled: { color: tokens.statusDisabled, label: t.nfc.off, sub: t.nfc.offSub, pulse: false },
    unsupported: { color: tokens.statusUnsupported, label: t.nfc.unsupported, sub: t.nfc.unsupportedSub, pulse: false },
  }[state];

  const inner = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: radii.lg,
          backgroundColor: tokens.surfaceCard,
          borderWidth: 1,
          borderColor: tokens.borderSoft,
        },
        style,
      ]}>
      <LiveDot color={meta.color} size={12} pulse={meta.pulse} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontFamily: fonts.display.semibold, fontSize: 16, color: tokens.textStrong }}>{meta.label}</Text>
        <Text style={{ fontFamily: fonts.body.regular, fontSize: 14, color: tokens.textMuted }}>{meta.sub}</Text>
      </View>
      {lastUid && (
        <Text
          style={{
            fontFamily: fonts.mono.regular,
            fontSize: 12,
            letterSpacing: 0.4,
            color: tokens.textBody,
            backgroundColor: tokens.surfaceSunken,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: radii.sm,
            overflow: 'hidden',
          }}>
          {lastUid}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

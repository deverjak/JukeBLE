import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';
import { Badge, IconButton } from './ui/primitives';
import { LiveDot } from './ui/anim';

function Logo() {
  const { tokens } = useTheme();
  return (
    <Text style={{ fontFamily: fonts.sans.semibold, fontSize: 20, letterSpacing: -0.6, color: tokens.fg0 }}>
      Juke<Text style={{ color: tokens.accentInk }}>NFC</Text>
    </Text>
  );
}

/**
 * Screen header: logo (or a custom left slot), NFC status badge that opens the
 * NFC screen, theme toggle, then the big title + mono subtitle.
 */
export function AppHeader({
  title,
  sub,
  showBack,
}: {
  title: string;
  sub: string;
  showBack?: boolean;
}) {
  const { tokens, theme, toggleTheme } = useTheme();
  const { nfcStatus } = useJukebox();
  const insets = useSafeAreaInsets();

  const scanning = nfcStatus === 'scanning';
  const ready = nfcStatus === 'idle';
  const badgeLabel = scanning ? 'aktivní' : ready ? 'připraveno' : nfcStatus === 'disabled' ? 'NFC vypnuto' : 'bez NFC';
  const badgeVariant = scanning ? 'ok' : ready ? 'warn' : 'err';
  const dotColor = scanning ? tokens.accent : ready ? tokens.warn : tokens.error;

  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 14, backgroundColor: tokens.bg0 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
        {showBack ? (
          <IconButton
            name="chevron-left"
            size={20}
            color={tokens.fg0}
            onPress={() => router.back()}
            style={{ borderWidth: 1, borderColor: tokens.line1 }}
            accessibilityLabel="Zpět"
          />
        ) : (
          <Logo />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable onPress={() => router.push('/nfc')} hitSlop={6}>
            <Badge variant={badgeVariant} icon={<LiveDot color={dotColor} pulse={scanning} />}>
              {badgeLabel}
            </Badge>
          </Pressable>
          <IconButton
            name={theme === 'dark' ? 'sun' : 'moon'}
            onPress={toggleTheme}
            accessibilityLabel="Přepnout motiv"
          />
        </View>
      </View>
      <View style={{ marginTop: 14 }}>
        <Text style={{ fontFamily: fonts.sans.medium, fontSize: 30, letterSpacing: -0.6, color: tokens.fg0 }}>
          {title}
        </Text>
        <Text
          style={{
            fontFamily: fonts.mono.regular,
            fontSize: 11,
            letterSpacing: 0.88,
            textTransform: 'uppercase',
            color: tokens.fg2,
            marginTop: 7,
          }}>
          {sub}
        </Text>
      </View>
    </View>
  );
}

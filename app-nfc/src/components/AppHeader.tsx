import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLang } from '../i18n';
import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts, radii } from '../theme/tokens';
import { Wordmark } from './Logo';
import { NfcStatusRow } from './ui/NfcStatus';
import { IconButton } from './ui/primitives';

/**
 * Screen header: wordmark (or back), language + theme toggles, a settings gear
 * that opens the NFC/settings screen, the big title + mono subtitle, and (on
 * tab screens) the tappable NFC reader status row.
 */
export function AppHeader({
  title,
  sub,
  showBack,
  showStatus = true,
}: {
  title: string;
  sub: string;
  showBack?: boolean;
  showStatus?: boolean;
}) {
  const { tokens, theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const { nfcStatus, lastUid } = useJukebox();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: tokens.bgPage }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
        {showBack ? (
          <IconButton name="chevron-left" size={20} variant="ghost" onPress={() => router.back()} accessibilityLabel="Back" />
        ) : (
          <Wordmark />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable
            onPress={toggleLang}
            hitSlop={6}
            style={{
              paddingHorizontal: 12,
              height: 36,
              borderRadius: radii.pill,
              borderWidth: 2,
              borderColor: tokens.borderMid,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontFamily: fonts.display.semibold, fontSize: 13, letterSpacing: 0.4, color: tokens.textBody }}>
              {lang.toUpperCase()}
            </Text>
          </Pressable>
          <IconButton name={theme === 'dark' ? 'sun' : 'moon'} onPress={toggleTheme} accessibilityLabel="Toggle theme" />
          {!showBack && <IconButton name="settings" onPress={() => router.push('/nfc')} accessibilityLabel="Settings" />}
        </View>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={{ fontFamily: fonts.display.bold, fontSize: 30, letterSpacing: -0.6, color: tokens.textStrong }}>
          {title}
        </Text>
        <Text
          style={{
            fontFamily: fonts.mono.regular,
            fontSize: 11,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: tokens.textFaint,
            marginTop: 6,
          }}>
          {sub}
        </Text>
      </View>

      {showStatus && !showBack && (
        <NfcStatusRow
          state={nfcStatus}
          lastUid={lastUid}
          onPress={() => router.push('/nfc')}
          style={{ marginTop: 14 }}
        />
      )}
    </View>
  );
}

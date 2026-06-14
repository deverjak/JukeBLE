import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Icon } from '../../components/Icon';
import { NowPlayingCard } from '../../components/NowPlayingCard';
import { Simulator } from '../../components/Simulator';
import { TapPrompt } from '../../components/TapPrompt';
import { LiveDot } from '../../components/ui/anim';
import { Card, ConsoleRow, ConsoleValue, SectionLabel, monoText } from '../../components/ui/primitives';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';
import type { NfcStatus } from '../../types';

const NFC_STATUS_TEXT: Record<NfcStatus, string> = {
  scanning: 'naslouchám…',
  idle: 'připraveno',
  disabled: 'NFC vypnuto',
  unsupported: 'NFC není dostupné',
};

export default function HomeScreen() {
  const { tokens } = useTheme();
  const { mode, nfcStatus, nowPlaying, lastUid } = useJukebox();

  const scanning = nfcStatus === 'scanning';
  const ready = nfcStatus === 'idle';
  const statusColor = scanning ? tokens.accentInk : ready ? tokens.warn : tokens.error;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0 }}>
      <AppHeader title="Přehrávač" sub="NFC JUKEBOX" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 24, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {/* Status console */}
        <Card style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
          <SectionLabel right={<Text style={[monoText(tokens.fg3, 10), { letterSpacing: 0.6 }]}>NFC · TAG</Text>}>
            Stav čtečky
          </SectionLabel>
          <ConsoleRow k="NFC" first>
            <LiveDot color={statusColor} size={7} pulse={scanning} />
            <ConsoleValue color={statusColor}>{NFC_STATUS_TEXT[nfcStatus]}</ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k="MÓD">
            <ConsoleValue color={mode === 'play' ? tokens.accentInk : tokens.fg0}>
              {mode === 'play' ? 'přehrávání' : 'registrace'}
            </ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k="POSLEDNÍ UID">
            <ConsoleValue color={lastUid ? tokens.fg0 : tokens.fg4}>{lastUid ?? '—'}</ConsoleValue>
          </ConsoleRow>
        </Card>

        {/* Not-listening CTA */}
        {!scanning && (
          <Pressable
            onPress={() => router.push('/nfc')}
            style={({ pressed }) => ({
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: tokens.line1,
              backgroundColor: pressed ? tokens.bg2 : tokens.bg1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            })}>
            <Icon name={ready ? 'contactless' : 'alert'} size={22} color={ready ? tokens.fg2 : tokens.error} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.sans.medium, fontSize: 15, color: tokens.fg0 }}>
                {nfcStatus === 'unsupported'
                  ? 'NFC není na tomto zařízení'
                  : nfcStatus === 'disabled'
                    ? 'NFC je vypnuté'
                    : 'NFC čtení neběží'}
              </Text>
              <Text style={[monoText(tokens.fg2), { marginTop: 3 }]}>
                {nfcStatus === 'unsupported'
                  ? 'Karty nelze načítat'
                  : nfcStatus === 'disabled'
                    ? 'Zapněte NFC v nastavení telefonu'
                    : 'Spusťte naslouchání kartám'}
              </Text>
            </View>
            <Icon name="chevron-right" size={18} color={tokens.fg3} />
          </Pressable>
        )}

        {/* Context per mode */}
        {mode === 'play' &&
          (nowPlaying ? (
            <View>
              <SectionLabel>Právě hraje</SectionLabel>
              <NowPlayingCard />
            </View>
          ) : (
            <TapPrompt active={scanning} mode="play" />
          ))}
        {mode === 'registration' && <TapPrompt active={scanning} mode="registration" />}

        {/* DEV-only reader simulator */}
        <Simulator />
      </ScrollView>
    </View>
  );
}

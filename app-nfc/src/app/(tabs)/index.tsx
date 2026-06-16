import { ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { NowPlayingCard } from '../../components/NowPlayingCard';
import { Simulator } from '../../components/Simulator';
import { TapPrompt } from '../../components/TapPrompt';
import { LiveDot } from '../../components/ui/anim';
import { Card, ConsoleRow, ConsoleValue, SectionLabel, monoText } from '../../components/ui/primitives';
import { useT, fmt } from '../../i18n';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';

export default function HomeScreen() {
  const { tokens } = useTheme();
  const t = useT();
  const { mode, nfcStatus, nowPlaying, lastUid, sounds, cards } = useJukebox();

  const scanning = nfcStatus === 'scanning';
  const ready = nfcStatus === 'idle';
  const statusColor = scanning ? tokens.statusListening : ready ? tokens.statusReady : tokens.statusUnsupported;
  const statusLabel = scanning ? t.nfc.listening : ready ? t.nfc.ready : nfcStatus === 'disabled' ? t.nfc.off : t.nfc.unsupported;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bgPage }}>
      <AppHeader title={t.tabs.player} sub={t.subs.player} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 24, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {/* Reader status console */}
        <View>
          <SectionLabel right={<Text style={[monoText(tokens.textFaint, 10), { letterSpacing: 0.8 }]}>{t.player.onDevice}</Text>}>
            {t.player.readerStatus}
          </SectionLabel>
          <Card pad="sm">
            <ConsoleRow k="NFC" first>
              <LiveDot color={statusColor} size={7} pulse={scanning} />
              <ConsoleValue color={statusColor}>{statusLabel}</ConsoleValue>
            </ConsoleRow>
            <ConsoleRow k="MODE">
              <ConsoleValue color={mode === 'play' ? tokens.success : tokens.brand}>
                {mode === 'play' ? t.modes.play : t.modes.registration}
              </ConsoleValue>
            </ConsoleRow>
            <ConsoleRow k={t.nfc.lastUid}>
              <ConsoleValue color={lastUid ? tokens.textStrong : tokens.textFaint}>{lastUid ?? t.common.dash}</ConsoleValue>
            </ConsoleRow>
            <ConsoleRow k={t.player.library}>
              <ConsoleValue>
                {fmt(t.player.soundsCount, { n: sounds.length })} · {fmt(t.player.cardsCount, { n: cards.length })}
              </ConsoleValue>
            </ConsoleRow>
          </Card>
        </View>

        {/* Now playing / tap prompt */}
        {mode === 'play' && nowPlaying ? (
          <View>
            <SectionLabel>{t.player.nowPlaying}</SectionLabel>
            <NowPlayingCard />
          </View>
        ) : (
          <TapPrompt active={scanning} mode={mode} />
        )}

        {/* DEV-only reader simulator */}
        <Simulator />
      </ScrollView>
    </View>
  );
}

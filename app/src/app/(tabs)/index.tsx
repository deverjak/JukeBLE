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
import type { ConnectionStatus } from '../../types';

const BLE_STATUS_TEXT: Record<ConnectionStatus, string> = {
  connected: 'připojeno',
  connecting: 'připojuji…',
  reconnecting: 'obnovuji spojení…',
  scanning: 'skenuji…',
  disconnected: 'odpojeno',
};

export default function HomeScreen() {
  const { tokens } = useTheme();
  const { mode, connection, nowPlaying, lastUid } = useJukebox();

  const status = connection.status;
  const connected = status === 'connected';
  const busy = status === 'connecting' || status === 'reconnecting' || status === 'scanning';
  const bleColor = connected ? tokens.accentInk : busy ? tokens.warn : tokens.error;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0 }}>
      <AppHeader title="Přehrávač" sub="RFID JUKEBOX" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 24, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {/* Status console */}
        <Card style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
          <SectionLabel right={<Text style={[monoText(tokens.fg3, 10), { letterSpacing: 0.6 }]}>GATT · NOTIFY</Text>}>
            Stav zařízení
          </SectionLabel>
          <ConsoleRow k="ZAŘÍZENÍ" first>
            <ConsoleValue color={connected ? tokens.fg0 : tokens.fg3}>
              {connection.device?.name ?? '—'}
            </ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k="BLE">
            <LiveDot color={bleColor} size={7} pulse={connected || busy} />
            <ConsoleValue color={bleColor}>{BLE_STATUS_TEXT[status]}</ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k="SIGNÁL">
            <ConsoleValue color={connected ? tokens.fg1 : tokens.fg4}>
              {connected && connection.device?.rssi != null ? `${connection.device.rssi} dBm` : '—'}
            </ConsoleValue>
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

        {/* Disconnected CTA */}
        {!connected && (
          <Pressable
            onPress={() => router.push('/pairing')}
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
            <Icon name="bluetooth-off" size={22} color={tokens.error} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.sans.medium, fontSize: 15, color: tokens.fg0 }}>
                Čtečka není připojena
              </Text>
              <Text style={[monoText(tokens.fg2), { marginTop: 3 }]}>Spárujte se zařízením RFID-Jukebox</Text>
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
            <TapPrompt connected={connected} mode="play" />
          ))}
        {mode === 'registration' && <TapPrompt connected={connected} mode="registration" />}

        {/* DEV-only reader simulator */}
        <Simulator />
      </ScrollView>
    </View>
  );
}

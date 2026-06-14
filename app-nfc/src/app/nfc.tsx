import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { LiveDot, RadarRings } from '../components/ui/anim';
import { Button } from '../components/ui/Button';
import { Badge, Card, ConsoleRow, ConsoleValue, SectionLabel, monoText } from '../components/ui/primitives';
import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';

export default function NfcScreen() {
  const { tokens } = useTheme();
  const { nfcStatus, startScan, stopScan, openNfcSettings, nfcLog, clearNfcLog } = useJukebox();

  const scanning = nfcStatus === 'scanning';
  const unsupported = nfcStatus === 'unsupported';
  const disabled = nfcStatus === 'disabled';

  const iconName = scanning ? 'contactless' : disabled || unsupported ? 'alert' : 'contactless';
  const iconColor = scanning ? tokens.accentInk : disabled || unsupported ? tokens.error : tokens.fg2;

  const title = scanning
    ? 'Naslouchám kartám…'
    : disabled
      ? 'NFC je vypnuté'
      : unsupported
        ? 'NFC není dostupné'
        : 'NFC připraveno';

  const subtitle = scanning
    ? 'Přiložte kartu k zadní straně telefonu'
    : disabled
      ? 'Zapněte NFC v nastavení telefonu a zkuste to znovu'
      : unsupported
        ? 'Toto zařízení nemá NFC hardware'
        : 'Spusťte čtení a přikládejte karty';

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0 }}>
      <AppHeader title="NFC" sub="NFC ČTEČKA" showBack />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 28, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {/* Status visual */}
        <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 4 }}>
          <View style={{ width: 110, height: 110, marginBottom: 18, alignItems: 'center', justifyContent: 'center' }}>
            {scanning && <RadarRings size={80} delays={[0, 450, 900]} />}
            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: 42,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: scanning ? tokens.accentSoft : tokens.bg1,
                borderWidth: 1,
                borderColor: scanning ? tokens.accent : tokens.line1,
              }}>
              <Icon name={iconName} size={34} color={iconColor} />
            </View>
          </View>
          <Text style={{ fontFamily: fonts.sans.medium, fontSize: 17, color: tokens.fg0 }}>{title}</Text>
          <Text style={[monoText(tokens.fg2, 11.5), { marginTop: 7, lineHeight: 17, textAlign: 'center', maxWidth: 280 }]}>
            {subtitle}
          </Text>
        </View>

        {/* Reader console */}
        <Card style={{ paddingVertical: 14, paddingHorizontal: 16 }}>
          <SectionLabel right={<Badge variant={scanning ? 'ok' : 'err'} icon={<LiveDot color={scanning ? tokens.accent : tokens.error} pulse={scanning} />}>{scanning ? 'online' : 'offline'}</Badge>}>
            Čtečka
          </SectionLabel>
          <ConsoleRow k="ZDROJ" first>
            <ConsoleValue>vestavěné NFC</ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k="REŽIM">
            <ConsoleValue>{Platform.OS === 'ios' ? 'session / sken' : 'průběžné čtení'}</ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k="AUTO-START">
            <ConsoleValue color={tokens.accentInk}>zapnuto</ConsoleValue>
          </ConsoleRow>
        </Card>

        {/* Actions */}
        {!unsupported && (
          <View style={{ gap: 10 }}>
            {scanning ? (
              <>
                <Button variant="danger" icon="stop" label="Zastavit čtení" onPress={stopScan} />
                <Button variant="secondary" label="Hotovo" onPress={() => router.back()} />
              </>
            ) : disabled ? (
              <>
                {Platform.OS === 'android' && (
                  <Button icon="zap" label="Otevřít nastavení NFC" onPress={openNfcSettings} />
                )}
                <Button variant="secondary" icon="refresh" label="Zkusit znovu" onPress={startScan} />
              </>
            ) : (
              <Button icon="contactless" label="Spustit čtení" onPress={startScan} />
            )}
          </View>
        )}

        {/* Event log — diagnostics */}
        <View>
          <SectionLabel
            right={
              nfcLog.length > 0 ? (
                <Pressable onPress={clearNfcLog} hitSlop={8}>
                  <Text style={[monoText(tokens.fg3, 10), { letterSpacing: 0.6 }]}>VYMAZAT</Text>
                </Pressable>
              ) : undefined
            }>
            Log událostí
          </SectionLabel>
          <Card style={{ paddingVertical: 12, paddingHorizontal: 14 }}>
            {nfcLog.length === 0 ? (
              <Text style={monoText(tokens.fg4, 11)}>Zatím žádné události…</Text>
            ) : (
              nfcLog.map((e, i) => {
                const color =
                  e.level === 'error' ? tokens.error : e.level === 'tag' ? tokens.accentInk : tokens.fg2;
                return (
                  <View key={`${e.time}-${i}`} style={{ flexDirection: 'row', gap: 8, paddingVertical: 1.5 }}>
                    <Text style={monoText(tokens.fg4, 10.5)}>{e.time}</Text>
                    <Text style={[monoText(color, 10.5), { flex: 1 }]}>{e.msg}</Text>
                  </View>
                );
              })
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

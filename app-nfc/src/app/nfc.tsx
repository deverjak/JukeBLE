import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { RadarRings } from '../components/ui/anim';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Badge, Card, ConsoleRow, ConsoleValue, SectionLabel, monoText } from '../components/ui/primitives';
import { useT } from '../i18n';
import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts, shadow, tones } from '../theme/tokens';

export default function NfcScreen() {
  const { tokens } = useTheme();
  const t = useT();
  const { nfcStatus, startScan, stopScan, openNfcSettings, nfcLog, clearNfcLog, keepAwake, setKeepAwake, autoResume, setAutoResume } =
    useJukebox();

  const scanning = nfcStatus === 'scanning';
  const unsupported = nfcStatus === 'unsupported';
  const disabled = nfcStatus === 'disabled';

  const meta = scanning
    ? { tone: tones.mint, title: t.nfc.listening, sub: t.nfc.listeningSub }
    : disabled
      ? { tone: tones.sunshine, title: t.nfc.off, sub: t.nfc.offSub }
      : unsupported
        ? { tone: tones.bubblegum, title: t.nfc.unsupported, sub: t.nfc.unsupportedSub }
        : { tone: tones.sky, title: t.nfc.ready, sub: t.nfc.readySub };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bgPage }}>
      <AppHeader title={t.nfc.title} sub={t.nfc.reader} showBack />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 28, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {/* Status visual */}
        <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 4 }}>
          <View style={{ width: 120, height: 120, marginBottom: 18, alignItems: 'center', justifyContent: 'center' }}>
            {scanning && <RadarRings size={88} delays={[0, 450, 900]} color={meta.tone.s400} />}
            <View
              style={[
                {
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: meta.tone.s500,
                },
                shadow('md'),
              ]}>
              <Icon name="nfc" size={36} color="#fff" />
            </View>
          </View>
          <Text style={{ fontFamily: fonts.display.semibold, fontSize: 19, color: tokens.textStrong }}>{meta.title}</Text>
          <Text style={{ fontFamily: fonts.body.regular, fontSize: 14, color: tokens.textMuted, marginTop: 6, textAlign: 'center', maxWidth: 280 }}>
            {meta.sub}
          </Text>
        </View>

        {/* Reader console */}
        <Card pad="sm">
          <SectionLabel right={<Badge tone={scanning ? 'mint' : 'danger'} dot>{scanning ? t.nfc.online : t.nfc.offline}</Badge>}>
            {t.nfc.reader}
          </SectionLabel>
          <ConsoleRow k={t.nfc.source} first>
            <ConsoleValue>{t.nfc.builtIn}</ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k={t.nfc.mode}>
            <ConsoleValue>{Platform.OS === 'ios' ? t.nfc.modeSession : t.nfc.modeContinuous}</ConsoleValue>
          </ConsoleRow>
          <ConsoleRow k={t.nfc.lastUid}>
            <ConsoleValue color={tokens.textFaint}>{t.common.dash}</ConsoleValue>
          </ConsoleRow>
        </Card>

        {/* Settings */}
        <Card pad="md" style={{ gap: 16 }}>
          <Switch checked={keepAwake} onChange={setKeepAwake} tone="grape" label={t.nfc.keepAwake} />
          <Switch checked={autoResume} onChange={setAutoResume} tone="grape" label={t.nfc.autoResume} />
        </Card>

        {/* Actions */}
        {!unsupported && (
          <View style={{ gap: 10 }}>
            {scanning ? (
              <>
                <Button block variant="danger" icon="square" label={t.nfc.stopReading} onPress={stopScan} />
                <Button block variant="ghost" label={t.nfc.done} onPress={() => router.back()} />
              </>
            ) : disabled ? (
              <>
                {Platform.OS === 'android' && <Button block icon="zap" label={t.nfc.turnOnNfc} onPress={openNfcSettings} />}
                <Button block variant="ghost" icon="refresh" label={t.nfc.retry} onPress={startScan} />
              </>
            ) : (
              <Button block icon="nfc" label={t.nfc.startReading} onPress={startScan} />
            )}
          </View>
        )}

        {/* Event log */}
        <View>
          <SectionLabel
            right={
              nfcLog.length > 0 ? (
                <Pressable onPress={clearNfcLog} hitSlop={8}>
                  <Text style={[monoText(tokens.textFaint, 10), { letterSpacing: 0.6, textTransform: 'uppercase' }]}>{t.nfc.clear}</Text>
                </Pressable>
              ) : undefined
            }>
            {t.nfc.log}
          </SectionLabel>
          <Card pad="sm">
            {nfcLog.length === 0 ? (
              <Text style={monoText(tokens.textFaint, 11)}>{t.nfc.noEvents}</Text>
            ) : (
              nfcLog.map((e, i) => {
                const color = e.level === 'error' ? tokens.danger : e.level === 'tag' ? tokens.success : tokens.textMuted;
                return (
                  <View key={`${e.time}-${i}`} style={{ flexDirection: 'row', gap: 8, paddingVertical: 1.5 }}>
                    <Text style={monoText(tokens.textFaint, 10.5)}>{e.time}</Text>
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

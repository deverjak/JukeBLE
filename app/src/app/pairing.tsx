import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../components/AppHeader';
import { Icon } from '../components/Icon';
import { LiveDot, RadarRings, Spinner } from '../components/ui/anim';
import { Button } from '../components/ui/Button';
import {
  Badge,
  Card,
  ConsoleRow,
  ConsoleValue,
  Row,
  SectionLabel,
  monoText,
} from '../components/ui/primitives';
import { BLE_SERVICE_UUID, BLE_UID_CHARACTERISTIC_UUID } from '../constants/ble';
import { ble } from '../services/ble';
import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { alpha, fonts } from '../theme/tokens';
import type { DeviceInfo } from '../types';

export default function PairingScreen() {
  const { tokens } = useTheme();
  const { connection, connectToDevice, disconnectReader } = useJukebox();

  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState<DeviceInfo[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const connected = connection.status === 'connected';
  const device = connection.device;

  // leaving the screen stops any running scan
  useEffect(() => () => ble.stopScan(), []);

  const startScan = async () => {
    setFound([]);
    setScanning(true);
    await ble.startScan((d) => {
      setFound((prev) => {
        const at = prev.findIndex((p) => p.id === d.id);
        if (at >= 0) {
          const next = [...prev];
          next[at] = d;
          return next;
        }
        return [...prev, d];
      });
    });
    setScanning(false);
  };

  const connect = async (d: DeviceInfo) => {
    setConnectingId(d.id);
    const ok = await connectToDevice(d);
    setConnectingId(null);
    if (ok) {
      setFound([]);
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0 }}>
      <AppHeader title="Párování" sub="BLE LINK" showBack />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 28, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {connected && device ? (
          <View>
            <SectionLabel>Připojené zařízení</SectionLabel>
            <Card style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tokens.accentSoft,
                    borderWidth: 1,
                    borderColor: alpha(tokens.accent, 0.3),
                  }}>
                  <Icon name="bluetooth-connected" size={24} color={tokens.accentInk} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.sans.medium, fontSize: 16, color: tokens.fg0 }}>
                    {device.name ?? 'RFID čtečka'}
                  </Text>
                  <Text style={[monoText(tokens.fg2), { marginTop: 3 }]} numberOfLines={1}>
                    {device.id}
                  </Text>
                </View>
                <Badge variant="ok" icon={<LiveDot color={tokens.accent} />}>
                  {device.rssi != null ? `${device.rssi} dBm` : 'online'}
                </Badge>
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <Button variant="danger" icon="unlink" label="Odpojit" onPress={disconnectReader} style={{ flex: 1 }} />
                <Button variant="secondary" label="Hotovo" onPress={() => router.back()} style={{ flex: 1 }} />
              </View>
            </Card>
            <Card style={{ paddingVertical: 14, paddingHorizontal: 16, marginTop: 16 }}>
              <ConsoleRow k="SERVICE" first>
                <ConsoleValue>{BLE_SERVICE_UUID.slice(0, 8)}…</ConsoleValue>
              </ConsoleRow>
              <ConsoleRow k="CHAR">
                <ConsoleValue>{BLE_UID_CHARACTERISTIC_UUID.slice(0, 8)} · NOTIFY</ConsoleValue>
              </ConsoleRow>
              <ConsoleRow k="AUTO-RECONNECT">
                <ConsoleValue color={tokens.accentInk}>zapnuto</ConsoleValue>
              </ConsoleRow>
            </Card>
          </View>
        ) : (
          <>
            {/* Scan visual */}
            <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 4 }}>
              <View
                style={{
                  width: 110,
                  height: 110,
                  marginBottom: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {scanning && <RadarRings size={80} delays={[0, 450, 900]} />}
                <View
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 42,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tokens.bg1,
                    borderWidth: 1,
                    borderColor: tokens.line1,
                  }}>
                  <Icon
                    name={scanning ? 'search' : 'bluetooth'}
                    size={34}
                    color={scanning ? tokens.accentInk : tokens.fg2}
                  />
                </View>
              </View>
              <Text style={{ fontFamily: fonts.sans.medium, fontSize: 17, color: tokens.fg0 }}>
                {scanning ? 'Hledám zařízení…' : 'Připojte RFID čtečku'}
              </Text>
              <Text style={[monoText(tokens.fg2, 11.5), { marginTop: 7, lineHeight: 17, textAlign: 'center' }]}>
                {scanning ? 'Filtrováno podle service UUID' : 'BLE sken najde čtečku v dosahu'}
              </Text>
            </View>

            {/* Found devices */}
            {found.length > 0 && (
              <View>
                <SectionLabel right={scanning ? <Spinner size={13} color={tokens.fg3} /> : undefined}>
                  {`Nalezená zařízení · ${found.length}`}
                </SectionLabel>
                <Card style={{ overflow: 'hidden' }}>
                  {found.map((d, i) => (
                    <Row key={d.id} first={i === 0}>
                      <Icon name="bluetooth" size={20} color={tokens.accentInk} />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontFamily: fonts.sans.medium, fontSize: 15, color: tokens.fg0 }}>
                          {d.name ?? 'Bezejmenné zařízení'}
                        </Text>
                        <Text style={[monoText(tokens.fg3, 10.5), { marginTop: 2 }]} numberOfLines={1}>
                          {d.id}
                          {d.rssi != null ? ` · ${d.rssi} dBm` : ''}
                        </Text>
                      </View>
                      <Button
                        small
                        label="Připojit"
                        loading={connectingId === d.id}
                        disabled={connectingId != null}
                        onPress={() => connect(d)}
                      />
                    </Row>
                  ))}
                </Card>
              </View>
            )}

            <Button
              icon={scanning ? undefined : 'refresh'}
              label={scanning ? 'Skenuji…' : found.length > 0 ? 'Skenovat znovu' : 'Spustit sken'}
              loading={scanning}
              onPress={startScan}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

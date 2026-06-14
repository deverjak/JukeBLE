import { Pressable, Text, View } from 'react-native';

import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';
import { truncate } from '../utils/format';
import { Icon } from './Icon';
import { Card, SectionLabel, monoText } from './ui/primitives';

const UNKNOWN_UID = 'DE:AD:BE:EF';

/**
 * DEV-only reader simulator — feeds UIDs into the same pipeline as an NFC tag
 * tap, so the whole registration/play flow can be exercised without a physical
 * NFC card. Not rendered in production builds.
 */
export function Simulator() {
  const { tokens } = useTheme();
  const { cards, simulateUid } = useJukebox();

  if (!__DEV__) return null;

  const simCards = [
    ...cards.map((c) => ({ uid: c.uid, label: truncate(c.name, 12), unknown: false })),
    { uid: UNKNOWN_UID, label: 'Neznámá', unknown: true },
  ];

  return (
    <View>
      <SectionLabel right={<Text style={[monoText(tokens.fg3, 10), { letterSpacing: 0.6 }]}>DEMO</Text>}>
        Simulátor čtečky
      </SectionLabel>
      <Card style={{ padding: 14 }}>
        <Text
          style={{
            fontFamily: fonts.sans.regular,
            fontSize: 12.5,
            color: tokens.fg2,
            marginBottom: 12,
            lineHeight: 18,
          }}>
          Vývojový režim — pošle UID do aplikace, jako by přišlo z NFC karty.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {simCards.map((c) => (
            <Pressable
              key={c.uid}
              onPress={() => simulateUid(c.uid)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingVertical: 9,
                paddingHorizontal: 12,
                borderRadius: 9,
                borderWidth: 1,
                borderColor: tokens.line1,
                backgroundColor: pressed ? tokens.bg3 : tokens.bg2,
              })}>
              <Icon name="contactless" size={15} color={c.unknown ? tokens.fg3 : tokens.accentInk} />
              <Text style={monoText(tokens.fg0, 11.5)}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </View>
  );
}

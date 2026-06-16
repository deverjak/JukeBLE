import { Pressable, Text, View } from 'react-native';

import { useT } from '../i18n';
import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts, radii } from '../theme/tokens';
import { truncate } from '../utils/format';
import { Icon } from './Icon';
import { Card, SectionLabel, monoText } from './ui/primitives';

const UNKNOWN_UID = 'DE:AD:BE:EF';

/**
 * DEV-only reader simulator — feeds UIDs into the same pipeline as an NFC tag
 * tap. Not rendered in production builds.
 */
export function Simulator() {
  const { tokens } = useTheme();
  const t = useT();
  const { cards, simulateUid } = useJukebox();

  if (!__DEV__) return null;

  const simCards = [
    ...cards.map((c) => ({ uid: c.uid, label: truncate(c.name, 12), unknown: false })),
    { uid: UNKNOWN_UID, label: t.player.unknown, unknown: true },
  ];

  return (
    <View>
      <SectionLabel right={<Text style={[monoText(tokens.textFaint, 10), { letterSpacing: 0.6 }]}>{t.player.demo}</Text>}>
        {t.player.tapSimulator}
      </SectionLabel>
      <Card pad="sm">
        <Text style={{ fontFamily: fonts.body.regular, fontSize: 13, color: tokens.textMuted, marginBottom: 12, lineHeight: 19 }}>
          {t.player.simHint}
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
                paddingHorizontal: 13,
                borderRadius: radii.pill,
                borderWidth: 1,
                borderColor: tokens.borderMid,
                backgroundColor: tokens.surfaceSunken,
                transform: pressed ? [{ scale: 0.94 }] : undefined,
              })}>
              <Icon name="nfc" size={15} color={c.unknown ? tokens.textFaint : tokens.brand} />
              <Text style={monoText(tokens.textBody, 12)}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>
    </View>
  );
}

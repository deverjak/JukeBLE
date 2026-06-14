import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Icon } from '../../components/Icon';
import { EqBars } from '../../components/ui/anim';
import { Button } from '../../components/ui/Button';
import {
  Card,
  EmptyState,
  IconButton,
  Row,
  SectionLabel,
  monoText,
} from '../../components/ui/primitives';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { alpha, fonts } from '../../theme/tokens';
import { fmtClock } from '../../utils/format';

export default function LibraryScreen() {
  const { tokens } = useTheme();
  const { sounds, cards, importing, importToLibrary, previewSound, previewSoundId, askDeleteSound } = useJukebox();

  const usage = (soundId: number) => cards.filter((c) => c.soundId === soundId).length;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0 }}>
      <AppHeader title="Knihovna" sub="ZVUKOVÉ SOUBORY" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}>
        <Button
          icon="upload"
          label={importing ? 'Importuji…' : 'Přidat zvuk'}
          loading={importing}
          onPress={importToLibrary}
          style={{ marginBottom: 20 }}
        />

        {sounds.length === 0 ? (
          <EmptyState
            icon="audio-lines"
            title="Žádné zvuky"
            body="Importujte MP3, WAV nebo M4A z telefonu. Soubor se zkopíruje do aplikace."
          />
        ) : (
          <>
            <SectionLabel right={<Text style={monoText(tokens.fg3, 10)}>{sounds.length} souborů</Text>}>
              Knihovna
            </SectionLabel>
            <Card style={{ overflow: 'hidden' }}>
              {sounds.map((sound, i) => {
                const used = usage(sound.id);
                const isPreviewing = previewSoundId === sound.id;
                return (
                  <Row key={sound.id} first={i === 0}>
                    <Pressable
                      onPress={() => previewSound(sound.id)}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isPreviewing ? tokens.accentSoft : tokens.bg2,
                        borderWidth: 1,
                        borderColor: isPreviewing ? alpha(tokens.accent, 0.3) : tokens.line1,
                      }}>
                      {isPreviewing ? (
                        <EqBars playing size={18} />
                      ) : (
                        <Icon name="play" size={16} color={tokens.fg1} />
                      )}
                    </Pressable>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text numberOfLines={1} style={{ fontFamily: fonts.sans.medium, fontSize: 15, color: tokens.fg0 }}>
                        {sound.name}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 3 }}>
                        <Text style={monoText(tokens.fg2)}>{sound.type || '—'}</Text>
                        <Text style={monoText(tokens.fg4)}>·</Text>
                        <Text style={monoText(tokens.fg2)}>{fmtClock(sound.duration)}</Text>
                        <Text style={monoText(tokens.fg4)}>·</Text>
                        <Text style={monoText(used ? tokens.accentInk : tokens.fg3)}>
                          {used ? `${used}× přiřazeno` : 'nepřiřazeno'}
                        </Text>
                      </View>
                    </View>
                    <IconButton name="trash" size={18} onPress={() => askDeleteSound(sound)} accessibilityLabel="Smazat" />
                  </Row>
                );
              })}
            </Card>
            <Text style={[monoText(tokens.fg3, 11.5), { marginTop: 14, lineHeight: 17 }]}>
              Soubory jsou uloženy lokálně v telefonu. Žádný server.
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

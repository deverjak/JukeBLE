import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Icon } from '../../components/Icon';
import { EqBars } from '../../components/ui/anim';
import { Button } from '../../components/ui/Button';
import { Card, EmptyState, IconButton, Row, SectionLabel, monoText } from '../../components/ui/primitives';
import { fmt, useT } from '../../i18n';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts, radii, tones } from '../../theme/tokens';
import { fmtClock } from '../../utils/format';

export default function LibraryScreen() {
  const { tokens } = useTheme();
  const t = useT();
  const { sounds, cards, importing, importToLibrary, previewSound, previewSoundId, openVolume, askDeleteSound } =
    useJukebox();

  const usage = (soundId: number) => cards.filter((c) => c.soundId === soundId).length;

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bgPage }}>
      <AppHeader title={t.tabs.sounds} sub={t.subs.sounds} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}>
        <Button
          block
          icon={importing ? 'audio-lines' : 'upload'}
          label={importing ? t.sounds.importing : t.sounds.add}
          loading={importing}
          onPress={importToLibrary}
          style={{ marginBottom: 20 }}
        />

        {sounds.length === 0 ? (
          <EmptyState icon="audio-lines" tone="tangerine" title={t.sounds.noTitle} body={t.sounds.noBody} />
        ) : (
          <>
            <SectionLabel right={<Text style={monoText(tokens.textFaint, 10)}>{fmt(t.sounds.files, { n: sounds.length })}</Text>}>
              {t.sounds.library}
            </SectionLabel>
            <Card>
              {sounds.map((sound, i) => {
                const used = usage(sound.id);
                const isPreviewing = previewSoundId === sound.id;
                return (
                  <Row key={sound.id} first={i === 0}>
                    <Pressable
                      onPress={() => previewSound(sound.id)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: radii.md,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isPreviewing ? tones.mint.s500 : tokens.surfaceSunken,
                        borderWidth: 1,
                        borderColor: tokens.borderSoft,
                      }}>
                      {isPreviewing ? (
                        <EqBars playing color="#fff" size={16} />
                      ) : (
                        <Icon name="play" size={16} color={tokens.textBody} />
                      )}
                    </Pressable>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text numberOfLines={1} style={{ fontFamily: fonts.display.semibold, fontSize: 15, color: tokens.textStrong }}>
                        {sound.name}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 3 }}>
                        <Text style={monoText(tokens.textMuted)}>{sound.type || t.common.dash}</Text>
                        <Text style={monoText(tokens.textFaint)}>·</Text>
                        <Text style={monoText(tokens.textMuted)}>{fmtClock(sound.duration)}</Text>
                        <Text style={monoText(tokens.textFaint)}>·</Text>
                        <Text style={monoText(used ? tokens.success : tokens.textFaint)}>
                          {used ? fmt(t.sounds.mapped, { n: used }) : t.sounds.unmapped}
                        </Text>
                      </View>
                    </View>
                    <IconButton name="sliders" size={18} onPress={() => openVolume(sound)} accessibilityLabel={t.volume.title} />
                    <IconButton name="trash" size={18} onPress={() => askDeleteSound(sound)} accessibilityLabel={t.common.delete} />
                  </Row>
                );
              })}
            </Card>
            <Text style={[monoText(tokens.textFaint, 11.5), { marginTop: 14, lineHeight: 18 }]}>{t.sounds.localNote}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

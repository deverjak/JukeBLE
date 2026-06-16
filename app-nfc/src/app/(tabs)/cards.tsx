import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { SwipeCardRow } from '../../components/SwipeCardRow';
import { Button } from '../../components/ui/Button';
import { EmptyState, SectionLabel, monoText } from '../../components/ui/primitives';
import { fmt, useT } from '../../i18n';
import { soundFileExists } from '../../services/library';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';

export default function CardsScreen() {
  const { tokens } = useTheme();
  const t = useT();
  const { cards, sounds, setMode, previewCard, previewUid, openCardAction, askDeleteCard } = useJukebox();

  const startRegister = () => {
    setMode('registration');
    router.navigate('/');
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bgPage }}>
      <AppHeader title={t.tabs.cards} sub={t.subs.cards} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}>
        {cards.length === 0 ? (
          <EmptyState
            icon="ticket"
            tone="grape"
            title={t.cards.noTitle}
            body={t.cards.noBody}
            action={<Button icon="plus" label={t.cards.registerCard} onPress={startRegister} />}
          />
        ) : (
          <>
            <SectionLabel right={<Text style={monoText(tokens.textFaint, 10)}>{fmt(t.cards.count, { n: cards.length })}</Text>}>
              {t.cards.registered}
            </SectionLabel>
            <View style={{ gap: 12 }}>
              {cards.map((card) => {
                const sound = card.soundId ? sounds.find((s) => s.id === card.soundId) : null;
                const missing = card.soundId != null && (!sound || !soundFileExists(sound.filePath));
                const badge = missing ? 'missing' : !card.soundId ? 'noSound' : 'none';
                const soundLabel = sound && !missing ? sound.name : missing ? t.cards.fileMissing : t.cards.noSound;
                return (
                  <SwipeCardRow
                    key={card.uid}
                    card={card}
                    soundLabel={soundLabel}
                    badge={badge}
                    playing={previewUid === card.uid}
                    onPreview={() => previewCard(card)}
                    onEdit={() => openCardAction(card)}
                    onDelete={() => askDeleteCard(card)}
                  />
                );
              })}
            </View>
            <Text style={[monoText(tokens.textFaint, 11.5), { marginTop: 16, lineHeight: 18 }]}>{t.cards.hint}</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

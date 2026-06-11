import { ScrollView, Text, View } from 'react-native';

import { AppHeader } from '../../components/AppHeader';
import { Icon } from '../../components/Icon';
import { Simulator } from '../../components/Simulator';
import { TapPrompt } from '../../components/TapPrompt';
import { Button } from '../../components/ui/Button';
import { Seg } from '../../components/ui/Seg';
import {
  Badge,
  Card,
  EmptyState,
  IconButton,
  Row,
  SectionLabel,
  monoText,
} from '../../components/ui/primitives';
import { soundFileExists } from '../../services/library';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';

export default function CardsScreen() {
  const { tokens } = useTheme();
  const { cards, sounds, mode, setMode, connection, openAssign, openRename, askDeleteCard } = useJukebox();
  const connected = connection.status === 'connected';

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0 }}>
      <AppHeader title="Karty" sub="MAPOVÁNÍ UID → ZVUK" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 28, gap: 22 }}
        showsVerticalScrollIndicator={false}>
        {/* Mode switch */}
        <View>
          <SectionLabel>Provozní mód</SectionLabel>
          <Seg
            value={mode}
            onChange={setMode}
            options={[
              { value: 'registration', label: 'Registrace', icon: 'plus' },
              { value: 'play', label: 'Přehrávání', icon: 'play', accent: true },
            ]}
          />
        </View>

        {mode === 'registration' && <TapPrompt connected={connected} mode="registration" />}

        {cards.length === 0 ? (
          mode === 'play' && (
            <EmptyState
              icon="card"
              title="Žádné karty"
              body="Přepněte výše do režimu registrace a přiložte kartu ke čtečce."
              action={
                <Button icon="plus" label="Registrovat kartu" onPress={() => setMode('registration')} />
              }
            />
          )
        ) : (
          <View>
            <SectionLabel right={<Text style={monoText(tokens.fg3, 10)}>{cards.length} karet</Text>}>
              Registrované karty
            </SectionLabel>
            <Card style={{ overflow: 'hidden' }}>
              {cards.map((card, i) => {
                const sound = card.soundId ? sounds.find((s) => s.id === card.soundId) : null;
                const fileMissing = card.soundId != null && (!sound || !soundFileExists(sound.filePath));
                return (
                  <Row key={card.uid} first={i === 0} alignTop>
                    <View
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        marginTop: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: tokens.bg2,
                        borderWidth: 1,
                        borderColor: tokens.line1,
                      }}>
                      <Icon name="card" size={20} color={tokens.fg1} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontFamily: fonts.sans.medium, fontSize: 15, color: tokens.fg0 }}>
                        {card.name}
                      </Text>
                      <Text style={[monoText(tokens.fg2), { marginTop: 3 }]}>{card.uid}</Text>
                      <View style={{ marginTop: 9, flexDirection: 'row' }}>
                        {sound && !fileMissing ? (
                          <Badge icon={<Icon name="music" size={12} color={tokens.fg1} />} textColor={tokens.fg1}>
                            {sound.name}
                          </Badge>
                        ) : fileMissing ? (
                          <Badge variant="err" icon={<Icon name="alert" size={12} color={tokens.error} />}>
                            soubor chybí
                          </Badge>
                        ) : (
                          <Badge variant="warn" icon={<Icon name="alert" size={12} color={tokens.warn} />}>
                            bez zvuku
                          </Badge>
                        )}
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                        <Button
                          small
                          variant="secondary"
                          icon="edit"
                          label="Přejmenovat"
                          onPress={() => openRename({ uid: card.uid, name: card.name })}
                        />
                        <Button
                          small
                          variant="secondary"
                          icon="music"
                          label="Zvuk"
                          onPress={() =>
                            openAssign({
                              uid: card.uid,
                              mode: 'remap',
                              currentName: card.name,
                              currentSoundId: card.soundId,
                            })
                          }
                        />
                      </View>
                    </View>
                    <IconButton name="trash" size={18} onPress={() => askDeleteCard(card)} accessibilityLabel="Smazat" />
                  </Row>
                );
              })}
            </Card>
          </View>
        )}

        {/* DEV-only reader simulator */}
        <Simulator />
      </ScrollView>
    </View>
  );
}

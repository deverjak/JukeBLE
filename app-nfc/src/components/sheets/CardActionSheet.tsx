import { Pressable, Text, View } from 'react-native';

import { useT } from '../../i18n';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { soundFileExists } from '../../services/library';
import { dangerTone, fonts, radii, tones, type ToneName } from '../../theme/tokens';
import type { CardRow } from '../../types';
import { Icon, type IconName } from '../Icon';
import { Sheet } from '../Sheet';

export function CardActionSheet() {
  const { cardAction } = useJukebox();
  if (!cardAction) return null;
  return <CardActionInner key={cardAction.uid} card={cardAction} />;
}

function CardActionInner({ card }: { card: CardRow }) {
  const { tokens } = useTheme();
  const t = useT();
  const { closeCardAction, sounds, previewCard, openRename, openAssign, askDeleteCard } = useJukebox();

  const sound = card.soundId ? sounds.find((s) => s.id === card.soundId) : null;
  const hasSound = !!sound && soundFileExists(sound.filePath);
  const soundLabel = hasSound ? sound!.name : card.soundId ? t.cards.fileMissing : t.cards.noSound;

  type Item = { icon: IconName; tone: ToneName | 'danger'; label: string; sub?: string; danger?: boolean; disabled?: boolean; on: () => void };
  const items: Item[] = [
    {
      icon: 'play',
      tone: 'mint',
      label: t.cardAction.previewSound,
      sub: soundLabel,
      disabled: !hasSound,
      on: () => {
        previewCard(card);
        closeCardAction();
      },
    },
    {
      icon: 'pencil',
      tone: 'sky',
      label: t.cardAction.renameCard,
      on: () => {
        closeCardAction();
        openRename({ uid: card.uid, name: card.name });
      },
    },
    {
      icon: 'music-2',
      tone: 'grape',
      label: t.cardAction.changeSound,
      on: () => {
        closeCardAction();
        openAssign({ uid: card.uid, mode: 'remap', currentName: card.name, currentSoundId: card.soundId });
      },
    },
    {
      icon: 'trash',
      tone: 'danger',
      label: t.cardAction.deleteCard,
      danger: true,
      on: () => {
        closeCardAction();
        askDeleteCard(card);
      },
    },
  ];

  return (
    <Sheet visible onClose={closeCardAction} label={card.uid} title={card.name}>
      <View style={{ gap: 10 }}>
        {items.map((it) => {
          const tile = it.tone === 'danger' ? dangerTone : tones[it.tone];
          return (
            <Pressable
              key={it.label}
              disabled={it.disabled}
              onPress={it.on}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                padding: 12,
                backgroundColor: tokens.surfaceCard,
                borderWidth: 1,
                borderColor: tokens.borderSoft,
                borderRadius: radii.lg,
                opacity: it.disabled ? 0.45 : pressed ? 0.8 : 1,
              })}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: radii.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: tile.s500,
                }}>
                <Icon name={it.icon} size={20} color="#fff" />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.display.semibold, fontSize: 15, color: it.danger ? tokens.danger : tokens.textStrong }}>
                  {it.label}
                </Text>
                {it.sub && (
                  <Text numberOfLines={1} style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.textMuted, marginTop: 2 }}>
                    {it.sub}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

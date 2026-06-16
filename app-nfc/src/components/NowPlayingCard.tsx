import { Text, View } from 'react-native';

import { useT } from '../i18n';
import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts, radii, tones } from '../theme/tokens';
import { cardVisual } from '../utils/cardVisual';
import { fmtClock } from '../utils/format';
import { Icon } from './Icon';
import { EqBars } from './ui/anim';
import { Card, IconButton } from './ui/primitives';

/** "Now playing" card with a colored tile, progress, card identity, stop. */
export function NowPlayingCard() {
  const { tokens } = useTheme();
  const t = useT();
  const { nowPlaying, cards, stopPlayback } = useJukebox();

  if (!nowPlaying) return null;
  const card = nowPlaying.uid ? cards.find((c) => c.uid === nowPlaying.uid) : null;
  const visual = nowPlaying.uid ? cardVisual(nowPlaying.uid) : null;
  const tone = visual ? tones[visual.tone] : tones.grape;
  const ratio = nowPlaying.duration > 0 ? Math.min(1, nowPlaying.position / nowPlaying.duration) : 0;

  return (
    <Card pad="md" radius={radii.xl}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: radii.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tone.s500,
            boxShadow: 'inset 0 -7px 16px rgba(0,0,0,0.16)',
          }}>
          {nowPlaying.playing ? (
            <EqBars playing color="#fff" size={24} />
          ) : (
            <Icon name={visual ? visual.icon : 'music'} size={28} color="#fff" />
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ fontFamily: fonts.display.semibold, fontSize: 18, color: tokens.textStrong }}>
            {nowPlaying.name}
          </Text>
          <Text numberOfLines={1} style={{ fontFamily: fonts.mono.regular, fontSize: 12, color: tokens.textMuted, marginTop: 4 }}>
            {card ? card.name : t.player.preview}
            {nowPlaying.uid ? ` · ${nowPlaying.uid}` : ''}
          </Text>
        </View>
        <IconButton
          name="square"
          size={18}
          variant="solid"
          tone={visual ? visual.tone : 'grape'}
          onPress={stopPlayback}
          accessibilityLabel="Stop"
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: tokens.surfaceSunken, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${ratio * 100}%`, borderRadius: 3, backgroundColor: tone.s500 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 }}>
          <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.textMuted }}>
            {fmtClock(nowPlaying.position)}
          </Text>
          <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.textMuted }}>
            {nowPlaying.playing ? t.player.oneAtATime : t.player.done}
          </Text>
          <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.textMuted }}>
            {fmtClock(nowPlaying.duration)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

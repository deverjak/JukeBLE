import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { alpha, fonts } from '../theme/tokens';
import { fmtClock } from '../utils/format';
import { Icon } from './Icon';
import { EqBars } from './ui/anim';
import { Card, IconButton } from './ui/primitives';

/** "Právě hraje" card with progress, card identity, and a stop button. */
export function NowPlayingCard() {
  const { tokens } = useTheme();
  const { nowPlaying, cards, stopPlayback } = useJukebox();

  if (!nowPlaying) return null;
  const card = nowPlaying.uid ? cards.find((c) => c.uid === nowPlaying.uid) : null;
  const ratio = nowPlaying.duration > 0 ? Math.min(1, nowPlaying.position / nowPlaying.duration) : 0;

  return (
    <Card style={{ padding: 16, overflow: 'hidden' }}>
      <LinearGradient
        colors={[alpha(tokens.accent, 0.12), 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 110 }}
        pointerEvents="none"
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.accentSoft,
            borderWidth: 1,
            borderColor: alpha(tokens.accent, 0.3),
          }}>
          {nowPlaying.playing ? (
            <EqBars playing color={tokens.accent} size={24} />
          ) : (
            <Icon name="music" size={26} color={tokens.accentInk} />
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={{ fontFamily: fonts.sans.medium, fontSize: 17, color: tokens.fg0 }}>
            {nowPlaying.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 4 }}>
            <Icon name="card" size={13} color={tokens.fg2} />
            <Text numberOfLines={1} style={{ fontFamily: fonts.mono.regular, fontSize: 12, color: tokens.fg2 }}>
              {card ? card.name : 'náhled'}
              {nowPlaying.uid ? ` · ${nowPlaying.uid}` : ''}
            </Text>
          </View>
        </View>
        <IconButton
          name="stop"
          size={18}
          color={tokens.fg0}
          onPress={stopPlayback}
          style={{ width: 44, height: 44, borderWidth: 1, borderColor: tokens.line2 }}
          accessibilityLabel="Zastavit"
        />
      </View>

      <View style={{ marginTop: 16 }}>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: tokens.bg3, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${ratio * 100}%`, borderRadius: 2, backgroundColor: tokens.accent }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 }}>
          <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.fg2 }}>
            {fmtClock(nowPlaying.position)}
          </Text>
          <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.fg2 }}>
            {nowPlaying.playing ? 'dohraje · zvuk doběhne' : 'dohráno'}
          </Text>
          <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.fg2 }}>
            {fmtClock(nowPlaying.duration)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

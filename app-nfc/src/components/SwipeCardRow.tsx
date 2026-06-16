import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useT } from '../i18n';
import type { CardRow } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { dangerTone, fonts, radii, shadow, tones } from '../theme/tokens';
import { cardVisual } from '../utils/cardVisual';
import { Icon } from './Icon';
import { EqBars } from './ui/anim';
import { Badge } from './ui/primitives';

const DRAWER = 152;

export function SwipeCardRow({
  card,
  soundLabel,
  badge,
  playing,
  onPreview,
  onEdit,
  onDelete,
}: {
  card: CardRow;
  soundLabel: string;
  badge: 'none' | 'missing' | 'noSound';
  playing: boolean;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { tokens } = useTheme();
  const t = useT();
  const visual = cardVisual(card.uid);
  const tone = tones[visual.tone];

  const tx = useSharedValue(0);
  const open = useSharedValue(false);

  const close = () => {
    open.value = false;
    tx.value = withSpring(0, { damping: 18, stiffness: 200 });
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      const base = open.value ? -DRAWER : 0;
      tx.value = Math.min(0, Math.max(-DRAWER, base + e.translationX));
    })
    .onEnd(() => {
      const shouldOpen = tx.value < -DRAWER / 2;
      open.value = shouldOpen;
      tx.value = withSpring(shouldOpen ? -DRAWER : 0, { damping: 18, stiffness: 200 });
    });

  const tap = Gesture.Tap().maxDistance(10).onEnd(() => {
    if (open.value) runOnJS(close)();
    else runOnJS(onPreview)();
  });

  const gesture = Gesture.Exclusive(pan, tap);
  const faceStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

  return (
    <View style={[{ borderRadius: radii.xl, overflow: 'hidden', backgroundColor: tokens.surfaceSunken }, shadow('sm')]}>
      {/* action drawer underneath */}
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, flexDirection: 'row' }}>
        <Pressable
          onPress={() => {
            close();
            onEdit();
          }}
          style={{ width: DRAWER / 2, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: tones.grape.s500 }}>
          <Icon name="pencil" size={20} color="#fff" />
          <Text style={{ fontFamily: fonts.body.extra, fontSize: 11, color: '#fff' }}>{t.cards.edit}</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            close();
            onDelete();
          }}
          style={{ width: DRAWER / 2, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: dangerTone.s500 }}>
          <Icon name="trash" size={20} color="#fff" />
          <Text style={{ fontFamily: fonts.body.extra, fontSize: 11, color: '#fff' }}>{t.common.delete}</Text>
        </Pressable>
      </View>

      {/* sliding face */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              padding: 14,
              backgroundColor: tokens.surfaceCard,
              borderWidth: 1,
              borderColor: tokens.borderMid,
              borderRadius: radii.xl,
            },
            faceStyle,
          ]}>
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
            {playing ? <EqBars playing color="#fff" size={24} /> : <Icon name={visual.icon} size={34} color="#fff" />}
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text
                numberOfLines={1}
                style={{ flexShrink: 1, fontFamily: fonts.display.semibold, fontSize: 18, color: tokens.textStrong }}>
                {card.name}
              </Text>
              {badge === 'missing' && (
                <Badge tone="danger" solid>
                  {t.cards.missing}
                </Badge>
              )}
              {badge === 'noSound' && (
                <Badge tone="sunshine" solid>
                  {t.cards.noSoundBadge}
                </Badge>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Icon name="music-2" size={13} color={tokens.textMuted} />
              <Text numberOfLines={1} style={{ flex: 1, fontFamily: fonts.body.bold, fontSize: 13, color: tokens.textMuted }}>
                {soundLabel}
              </Text>
            </View>
            <Text style={{ fontFamily: fonts.mono.regular, fontSize: 11, color: tokens.textFaint, marginTop: 4 }}>{card.uid}</Text>
          </View>
          <Icon name={playing ? 'square' : 'play'} size={18} color={tokens.textFaint} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

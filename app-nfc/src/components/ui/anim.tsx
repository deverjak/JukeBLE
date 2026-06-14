import { useEffect } from 'react';
import { Animated, Easing, View, useAnimatedValue } from 'react-native';

import { useTheme } from '../../theme/ThemeContext';
import { Icon } from '../Icon';

/* ── Rotating loader icon ─────────────────────────────────── */
export function Spinner({ size = 17, color }: { size?: number; color?: string }) {
  const { tokens } = useTheme();
  const spin = useAnimatedValue(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  return (
    <Animated.View
      style={{ transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
      <Icon name="loader" size={size} color={color ?? tokens.fg2} />
    </Animated.View>
  );
}

/* ── Pulsing live dot ─────────────────────────────────────── */
export function LiveDot({ color, size = 6, pulse = true }: { color: string; size?: number; pulse?: boolean }) {
  const opacity = useAnimatedValue(1);

  useEffect(() => {
    if (!pulse) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.35, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, pulse]);

  return (
    <Animated.View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: pulse ? opacity : 1 }}
    />
  );
}

/* ── Now-playing equalizer bars ───────────────────────────── */
const EQ_DELAYS = [0, 250, 500, 150, 400];
const EQ_IDLE_HEIGHTS = [0.5, 0.85, 0.65, 1, 0.55];

function EqBar({ playing, delay, idleScale, color, height }: { playing: boolean; delay: number; idleScale: number; color: string; height: number }) {
  const scale = useAnimatedValue(playing ? 0.35 : idleScale * 0.5);

  useEffect(() => {
    if (!playing) {
      scale.setValue(idleScale * 0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scale, { toValue: 1, duration: 450, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.35, duration: 450, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [playing, delay, idleScale, scale]);

  return (
    <View style={{ height, justifyContent: 'flex-end' }}>
      <Animated.View
        style={{
          width: 3,
          height,
          borderRadius: 2,
          backgroundColor: color,
          transform: [{ translateY: scale.interpolate({ inputRange: [0, 1], outputRange: [height / 2, 0] }) }, { scaleY: scale }],
        }}
      />
    </View>
  );
}

export function EqBars({ playing, color, size = 18 }: { playing: boolean; color?: string; size?: number }) {
  const { tokens } = useTheme();
  const barColor = color ?? tokens.accent;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2.5, height: size }}>
      {EQ_DELAYS.map((delay, i) => (
        <EqBar key={i} playing={playing} delay={delay} idleScale={EQ_IDLE_HEIGHTS[i]} color={barColor} height={size} />
      ))}
    </View>
  );
}

/* ── Radar rings (scan / tap prompt) ──────────────────────── */
function Ring({ size, delay, color }: { size: number; delay: number; color: string }) {
  const progress = useAnimatedValue(0);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    const timer = setTimeout(() => {
      loop = Animated.loop(
        Animated.timing(progress, { toValue: 1, duration: 1800, easing: Easing.out(Easing.cubic), useNativeDriver: true })
      );
      loop.start();
    }, delay);
    return () => {
      clearTimeout(timer);
      loop?.stop();
    };
  }, [delay, progress]);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
        transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.4] }) }],
      }}
    />
  );
}

export function RadarRings({ size, delays }: { size: number; delays: number[] }) {
  const { tokens } = useTheme();
  return (
    <>
      {delays.map((delay, i) => (
        <Ring key={i} size={size} delay={delay} color={tokens.accent} />
      ))}
    </>
  );
}

import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { Sheet } from './Sheet';
import { Button } from './ui/Button';

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Domů', icon: 'activity' },
  cards: { label: 'Karty', icon: 'card' },
  library: { label: 'Zvuky', icon: 'audio-lines' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useJukebox();

  /* Registration mode lives on the Cards tab — leaving it switches the mode
     back to play, so the switch must be confirmed instead of happening silently. */
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const guardActive = mode === 'registration' && state.routes[state.index].name === 'cards';

  /* Android hardware back from a non-first tab acts as a tab switch to Home,
     so it has to go through the same guard. */
  useEffect(() => {
    if (!guardActive) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!navigation.isFocused()) return false; // a stack screen (nfc) is on top
      setPendingTab(state.routes[0].name);
      return true;
    });
    return () => sub.remove();
  }, [guardActive, navigation, state.routes]);

  const confirmLeave = () => {
    if (!pendingTab) return;
    setMode('play');
    navigation.navigate(pendingTab);
    setPendingTab(null);
  };

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 8,
          paddingHorizontal: 12,
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopWidth: 1,
          borderTopColor: tokens.line1,
          backgroundColor: tokens.bg0,
        }}>
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name] ?? { label: route.name, icon: 'activity' as IconName };
          const active = state.index === index;
          const color = active ? tokens.accentInk : tokens.fg2;
          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (active || event.defaultPrevented) return;
                if (guardActive) {
                  setPendingTab(route.name);
                  return;
                }
                navigation.navigate(route.name);
              }}
              style={{ flex: 1, alignItems: 'center', gap: 5, paddingVertical: 7 }}>
              <Icon name={meta.icon} size={23} color={color} strokeWidth={active ? 2 : 1.5} />
              <Text
                style={{
                  fontFamily: active ? fonts.mono.semibold : fonts.mono.medium,
                  fontSize: 10,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  color,
                }}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {pendingTab != null && (
        <Sheet visible onClose={() => setPendingTab(null)} label="Provozní mód" title="Ukončit registraci?">
          <Text
            style={{
              fontFamily: fonts.sans.regular,
              fontSize: 14.5,
              color: tokens.fg1,
              lineHeight: 22,
              marginBottom: 22,
            }}>
            Opuštěním záložky Karty se provozní mód přepne z registrace na přehrávání.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              variant="ghost"
              label="Zůstat na kartách"
              onPress={() => setPendingTab(null)}
              style={{ flex: 1 }}
            />
            <Button icon="play" label="OK" onPress={confirmLeave} style={{ flex: 1 }} />
          </View>
        </Sheet>
      )}
    </>
  );
}

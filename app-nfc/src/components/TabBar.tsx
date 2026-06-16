import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useT } from '../i18n';
import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts, radii } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { Sheet } from './Sheet';
import { Button } from './ui/Button';

const TAB_ICON: Record<string, IconName> = {
  index: 'radio',
  cards: 'ticket',
  library: 'audio-lines',
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { tokens } = useTheme();
  const t = useT();
  const insets = useSafeAreaInsets();
  const { mode, setMode } = useJukebox();

  const tabLabel: Record<string, string> = {
    index: t.tabs.player,
    cards: t.tabs.cards,
    library: t.tabs.sounds,
  };

  /* Registration mode lives on the Cards tab — leaving it switches the mode
     back to play, so the switch must be confirmed instead of happening silently. */
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const guardActive = mode === 'registration' && state.routes[state.index].name === 'cards';

  useEffect(() => {
    if (!guardActive) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!navigation.isFocused()) return false;
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
          gap: 4,
          paddingTop: 8,
          paddingHorizontal: 12,
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopWidth: 1,
          borderTopColor: tokens.borderSoft,
          backgroundColor: tokens.bgPage,
        }}>
        {state.routes.map((route, index) => {
          const active = state.index === index;
          const color = active ? tokens.brand : tokens.textMuted;
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
              style={{ flex: 1, alignItems: 'center', gap: 6, paddingVertical: 6 }}>
              <View
                style={{
                  width: 52,
                  height: 30,
                  borderRadius: radii.pill,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: active ? tokens.brandSoft : 'transparent',
                }}>
                <Icon name={TAB_ICON[route.name] ?? 'radio'} size={22} color={color} strokeWidth={active ? 2.2 : 1.8} />
              </View>
              <Text
                style={{
                  fontFamily: active ? fonts.body.extra : fonts.body.bold,
                  fontSize: 11,
                  color,
                }}>
                {tabLabel[route.name] ?? route.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {pendingTab != null && (
        <Sheet visible onClose={() => setPendingTab(null)} label={t.player.operatingMode} title={t.guard.title}>
          <Text
            style={{
              fontFamily: fonts.body.regular,
              fontSize: 15,
              color: tokens.textBody,
              lineHeight: 22,
              marginBottom: 22,
            }}>
            {t.guard.body}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button variant="ghost" label={t.guard.stay} onPress={() => setPendingTab(null)} style={{ flex: 1 }} />
            <Button icon="play" label={t.guard.switchToPlay} onPress={confirmLeave} style={{ flex: 2 }} />
          </View>
        </Sheet>
      )}
    </>
  );
}

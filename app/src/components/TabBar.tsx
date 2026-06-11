import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';
import { Icon, type IconName } from './Icon';

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Domů', icon: 'activity' },
  cards: { label: 'Karty', icon: 'card' },
  library: { label: 'Zvuky', icon: 'audio-lines' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  return (
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
              if (!active && !event.defaultPrevented) navigation.navigate(route.name);
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
  );
}

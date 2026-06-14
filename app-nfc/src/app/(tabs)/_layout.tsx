import { Tabs } from 'expo-router';

import { TabBar } from '../../components/TabBar';
import { useTheme } from '../../theme/ThemeContext';

export default function TabsLayout() {
  const { tokens } = useTheme();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: tokens.bg0 } }}>
      <Tabs.Screen name="index" options={{ title: 'Domů' }} />
      <Tabs.Screen name="cards" options={{ title: 'Karty' }} />
      <Tabs.Screen name="library" options={{ title: 'Zvuky' }} />
    </Tabs>
  );
}

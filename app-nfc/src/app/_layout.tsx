import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
} from '@expo-google-fonts/geist-mono';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AssignSheet } from '../components/sheets/AssignSheet';
import { ConfirmSheet } from '../components/sheets/ConfirmSheet';
import { RenameSheet } from '../components/sheets/RenameSheet';
import { VolumeSheet } from '../components/sheets/VolumeSheet';
import { ToastHost } from '../components/Toast';
import { JukeboxProvider } from '../state/JukeboxContext';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootInner() {
  const { tokens, theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0 }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.bg0 },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="nfc" />
      </Stack>
      <ToastHost />
      <AssignSheet />
      <RenameSheet />
      <VolumeSheet />
      <ConfirmSheet />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    GeistMono_400Regular,
    GeistMono_500Medium,
    GeistMono_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <JukeboxProvider>
          <RootInner />
        </JukeboxProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

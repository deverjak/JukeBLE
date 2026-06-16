import {
  Baloo2_400Regular,
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import {
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AssignSheet } from '../components/sheets/AssignSheet';
import { CardActionSheet } from '../components/sheets/CardActionSheet';
import { ConfirmSheet } from '../components/sheets/ConfirmSheet';
import { RenameSheet } from '../components/sheets/RenameSheet';
import { VolumeSheet } from '../components/sheets/VolumeSheet';
import { ToastHost } from '../components/Toast';
import { LogoMark } from '../components/Logo';
import { LanguageProvider } from '../i18n';
import { enforceUpdate } from '../services/appUpdate';
import { JukeboxProvider, useJukebox } from '../state/JukeboxContext';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';

SplashScreen.preventAutoHideAsync();

function RootInner() {
  const { tokens, theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bgPage }}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tokens.bgPage },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="nfc" />
      </Stack>
      <ToastHost />
      <AssignSheet />
      <RenameSheet />
      <VolumeSheet />
      <CardActionSheet />
      <ConfirmSheet />
      <SplashOverlay />
    </View>
  );
}

/** Brief branded cover over the plum page until the DB has loaded. */
function SplashOverlay() {
  const { tokens } = useTheme();
  const { ready } = useJukebox();
  if (ready) return null;
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: tokens.bgPage,
      }}>
      <LogoMark size={96} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Force a blocking Play Store update on launch (Android, production only).
  useEffect(() => {
    enforceUpdate();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
          <ThemeProvider>
            <JukeboxProvider>
              <RootInner />
            </JukeboxProvider>
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

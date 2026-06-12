import { useEffect } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useAnimatedValue,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';
import { IconButton } from './ui/primitives';

/** Bottom sheet — gentle rise + scrim fade, matching the prototype. */
export function Sheet({
  visible,
  onClose,
  label,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  label?: string;
  title?: string;
  children: React.ReactNode;
}) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const progress = useAnimatedValue(0);

  useEffect(() => {
    if (visible) {
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 240,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, progress]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: tokens.scrim, opacity: progress }}>
          <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="Zavřít" />
        </Animated.View>
        {/* 'padding' on both platforms: adjustResize never reaches a statusBarTranslucent Modal on Android */}
        <KeyboardAvoidingView behavior="padding">
          <Animated.View
            style={{
              backgroundColor: tokens.bg1,
              borderTopWidth: 1,
              borderTopColor: tokens.line2,
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              paddingTop: 10,
              paddingHorizontal: 20,
              paddingBottom: insets.bottom + 24,
              maxHeight: Math.round(windowHeight * 0.88),
              transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [22, 0] }) }],
            }}>
            <View style={{ alignItems: 'center', paddingTop: 4, paddingBottom: 14 }}>
              <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: tokens.line2 }} />
            </View>
            {(title || label) && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 18,
                  gap: 12,
                }}>
                <View style={{ flexShrink: 1 }}>
                  {label && (
                    <Text
                      style={{
                        fontFamily: fonts.mono.regular,
                        fontSize: 11,
                        letterSpacing: 0.88,
                        textTransform: 'uppercase',
                        color: tokens.fg2,
                        marginBottom: 6,
                      }}>
                      {label}
                    </Text>
                  )}
                  {title && (
                    <Text style={{ fontFamily: fonts.sans.medium, fontSize: 22, letterSpacing: -0.22, color: tokens.fg0 }}>
                      {title}
                    </Text>
                  )}
                </View>
                <IconButton name="x" size={20} onPress={onClose} accessibilityLabel="Zavřít" />
              </View>
            )}
            <ScrollView bounces={false} keyboardShouldPersistTaps="handled" style={{ flexGrow: 0, flexShrink: 1 }}>
              {children}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

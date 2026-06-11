import { useEffect } from 'react';
import { Animated, Easing, Text, View, useAnimatedValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { Button } from './ui/Button';

/** Global toast overlay — rendered above the tab bar in the root layout. */
export function ToastHost() {
  const { toast, onToastAction } = useJukebox();
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const rise = useAnimatedValue(0);

  useEffect(() => {
    if (toast) {
      rise.setValue(0);
      Animated.timing(rise, {
        toValue: 1,
        duration: 240,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }).start();
    }
  }, [toast, rise]);

  if (!toast) return null;

  const iconName: IconName = toast.tone === 'error' ? 'alert' : toast.tone === 'ok' ? 'check-circle' : toast.tone === 'warn' ? 'alert' : 'zap';
  const iconColor =
    toast.tone === 'error'
      ? tokens.error
      : toast.tone === 'ok'
        ? tokens.accentInk
        : toast.tone === 'warn'
          ? tokens.warn
          : tokens.fg0;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 86,
        alignItems: 'center',
      }}>
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tokens.line1,
          backgroundColor: tokens.bg1,
          maxWidth: '100%',
          shadowColor: '#000',
          shadowOpacity: 0.35,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 12 },
          elevation: 8,
          opacity: rise,
          transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        }}>
        <Icon name={iconName} size={19} color={iconColor} />
        <Text style={{ fontFamily: fonts.sans.regular, fontSize: 14, color: tokens.fg0, flexShrink: 1, lineHeight: 19 }}>
          {toast.msg}
        </Text>
        {toast.action && (
          <Button small label={toast.action.label} onPress={() => onToastAction(toast.action!)} />
        )}
      </Animated.View>
    </View>
  );
}

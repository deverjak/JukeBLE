import { useEffect } from 'react';
import { Animated, Easing, Text, View, useAnimatedValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useJukebox } from '../state/JukeboxContext';
import { useTheme } from '../theme/ThemeContext';
import { fonts, radii, shadow } from '../theme/tokens';
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

  const iconName: IconName = toast.tone === 'error' ? 'alert-triangle' : toast.tone === 'ok' ? 'check-circle-2' : toast.tone === 'warn' ? 'alert-triangle' : 'zap';
  const iconColor =
    toast.tone === 'error'
      ? tokens.danger
      : toast.tone === 'ok'
        ? tokens.success
        : toast.tone === 'warn'
          ? tokens.warning
          : tokens.textStrong;

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
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: tokens.borderMid,
            backgroundColor: tokens.surfaceRaised,
            maxWidth: '100%',
            opacity: rise,
            transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
          },
          shadow('lg'),
        ]}>
        <Icon name={iconName} size={20} color={iconColor} />
        <Text style={{ fontFamily: fonts.body.semibold, fontSize: 14, color: tokens.textStrong, flexShrink: 1, lineHeight: 19 }}>
          {toast.msg}
        </Text>
        {toast.action && (
          <Button small label={toast.action.label} onPress={() => onToastAction(toast.action!)} />
        )}
      </Animated.View>
    </View>
  );
}

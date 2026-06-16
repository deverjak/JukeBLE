import { Text, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';

/** The JukeNFC logo mark — a grape play-card with yellow NFC arcs. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="jnfcCard" x1="20" y1="16" x2="96" y2="104" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#8b6bf8" />
          <Stop offset="1" stopColor="#6c4cf1" />
        </LinearGradient>
      </Defs>
      <Rect x={20} y={20} width={68} height={84} rx={18} rotation={-7} originX={54} originY={62} fill="url(#jnfcCard)" />
      <Path d="M44 47l21 14-21 14z" rotation={-7} originX={54} originY={62} fill="#fff" />
      <G stroke="#ffc23d" strokeWidth={6} strokeLinecap="round" fill="none">
        <Path d="M92 44a18 18 0 0 1 0 34" />
        <Path d="M101 34a32 32 0 0 1 0 54" />
      </G>
    </Svg>
  );
}

/** Mark + "Juke" + brand "NFC" wordmark. */
export function Wordmark({ size = 20 }: { size?: number }) {
  const { tokens } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <LogoMark size={size + 9} />
      <Text style={{ fontFamily: fonts.display.bold, fontSize: size, letterSpacing: -0.4, color: tokens.textStrong }}>
        Juke<Text style={{ color: tokens.brand }}>NFC</Text>
      </Text>
    </View>
  );
}

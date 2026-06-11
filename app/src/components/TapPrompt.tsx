import { Text, View } from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { fonts } from '../theme/tokens';
import { Icon } from './Icon';
import { RadarRings } from './ui/anim';

/** Dashed "tap a card" prompt shown when nothing is playing / in registration mode. */
export function TapPrompt({ connected, mode }: { connected: boolean; mode: 'play' | 'registration' }) {
  const { tokens } = useTheme();
  const reg = mode === 'registration';

  return (
    <View
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: tokens.line2,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: tokens.bg1,
        opacity: connected ? 1 : 0.55,
        overflow: 'hidden',
      }}>
      <View style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        {connected && <RadarRings size={56} delays={[0, 600]} />}
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: tokens.bg2,
            borderWidth: 1,
            borderColor: tokens.line1,
          }}>
          <Icon name="contactless" size={28} color={connected ? tokens.accentInk : tokens.fg3} />
        </View>
      </View>
      <Text style={{ fontFamily: fonts.sans.medium, fontSize: 16, color: tokens.fg0 }}>
        {connected ? (reg ? 'Přiložte kartu k registraci' : 'Přiložte kartu k přehrání') : 'Připojte čtečku'}
      </Text>
      <Text
        style={{
          fontFamily: fonts.mono.regular,
          fontSize: 11.5,
          color: tokens.fg2,
          marginTop: 7,
          maxWidth: 250,
          lineHeight: 17,
          textAlign: 'center',
        }}>
        {connected
          ? reg
            ? 'Nová karta otevře přiřazení zvuku. Známá karta nabídne přemapování.'
            : 'Namapovaný zvuk se spustí okamžitě.'
          : 'Bez připojené čtečky nepřijdou žádné UID.'}
      </Text>
    </View>
  );
}

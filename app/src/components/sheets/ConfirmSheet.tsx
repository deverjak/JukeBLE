import { Text, View } from 'react-native';

import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';
import { Sheet } from '../Sheet';
import { Button } from '../ui/Button';

export function ConfirmSheet() {
  const { tokens } = useTheme();
  const { confirm, closeConfirm, runConfirm } = useJukebox();

  if (!confirm) return null;

  return (
    <Sheet visible onClose={closeConfirm} label="Potvrzení" title={confirm.title}>
      <Text
        style={{
          fontFamily: fonts.sans.regular,
          fontSize: 14.5,
          color: tokens.fg1,
          lineHeight: 22,
          marginBottom: 22,
        }}>
        {confirm.body}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="ghost" label="Zrušit" onPress={closeConfirm} style={{ flex: 1 }} />
        <Button
          variant="danger"
          icon="trash"
          label="Smazat"
          onPress={runConfirm}
          style={{ flex: 1, borderColor: tokens.error }}
        />
      </View>
    </Sheet>
  );
}

import { Text, View } from 'react-native';

import { useT } from '../../i18n';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';
import { Sheet } from '../Sheet';
import { Button } from '../ui/Button';

export function ConfirmSheet() {
  const { tokens } = useTheme();
  const t = useT();
  const { confirm, closeConfirm, runConfirm } = useJukebox();

  if (!confirm) return null;

  return (
    <Sheet visible onClose={closeConfirm} title={confirm.title}>
      <Text
        style={{
          fontFamily: fonts.body.regular,
          fontSize: 15,
          color: tokens.textBody,
          lineHeight: 22,
          marginBottom: 22,
        }}>
        {confirm.body}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="ghost" label={t.common.cancel} onPress={closeConfirm} style={{ flex: 1 }} />
        <Button variant="danger" icon="trash" label={t.common.delete} onPress={runConfirm} style={{ flex: 1 }} />
      </View>
    </Sheet>
  );
}

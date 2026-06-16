import { useState } from 'react';
import { Text, View } from 'react-native';

import { useT } from '../../i18n';
import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts, radii } from '../../theme/tokens';
import type { AssignData } from '../../types';
import { fmtClock } from '../../utils/format';
import { Icon } from '../Icon';
import { Sheet } from '../Sheet';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge, Card, Radio, Row, monoText } from '../ui/primitives';

/** Register a new card or remap an existing one: name + assigned sound. */
export function AssignSheet() {
  const { assign } = useJukebox();
  if (!assign) return null;
  return <AssignSheetInner key={`${assign.uid}:${assign.mode}`} data={assign} />;
}

function AssignSheetInner({ data }: { data: AssignData }) {
  const { tokens } = useTheme();
  const t = useT();
  const { closeAssign, saveAssign, sounds, importSingleSound } = useJukebox();

  const [name, setName] = useState(data.currentName);
  const [soundId, setSoundId] = useState<number | null>(data.currentSoundId);
  const [importing, setImporting] = useState(false);

  const isNew = data.mode === 'new';

  const quickImport = async () => {
    setImporting(true);
    try {
      const importedId = await importSingleSound();
      if (importedId != null) setSoundId(importedId);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Sheet
      visible
      onClose={closeAssign}
      label={isNew ? t.assign.newCard : t.assign.editCard}
      title={isNew ? t.assign.registerTitle : data.currentName || data.uid}>
      {/* UID strip */}
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          marginBottom: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: tokens.surfaceSunken,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: tokens.borderSoft,
        }}>
        <Icon name="nfc" size={18} color={tokens.brand} />
        <Text style={[monoText(tokens.textStrong, 13), { flex: 1, letterSpacing: 0.4 }]} numberOfLines={1}>
          {data.uid}
        </Text>
        <Badge tone="grape">UID</Badge>
      </View>

      <Input label={t.assign.cardName} value={name} onChangeText={setName} placeholder={t.assign.cardNamePlaceholder} style={{ marginBottom: 20 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Text style={{ fontFamily: fonts.body.extra, fontSize: 14, color: tokens.textBody }}>{t.assign.assignedSound}</Text>
        <Button small variant="ghost" icon="upload" label={t.common.import} loading={importing} onPress={quickImport} />
      </View>

      <Card style={{ marginBottom: 22 }}>
        <Row first onPress={() => setSoundId(null)}>
          <Radio on={soundId === null} />
          <Text style={{ flex: 1, fontFamily: fonts.body.semibold, fontSize: 15, color: tokens.textMuted }}>
            {t.assign.noneAssignLater}
          </Text>
        </Row>
        {sounds.map((s) => (
          <Row key={s.id} onPress={() => setSoundId(s.id)}>
            <Radio on={soundId === s.id} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={{ fontFamily: fonts.display.semibold, fontSize: 15, color: tokens.textStrong }}>
                {s.name}
              </Text>
              <Text style={[monoText(tokens.textMuted), { marginTop: 2 }]}>
                {s.type} · {fmtClock(s.duration)}
              </Text>
            </View>
          </Row>
        ))}
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="ghost" label={t.common.cancel} onPress={closeAssign} style={{ flex: 1 }} />
        <Button
          icon="check"
          label={isNew ? t.common.register : t.common.save}
          disabled={!name.trim()}
          onPress={() => saveAssign({ uid: data.uid, name: name.trim(), soundId, isNew })}
          style={{ flex: 2 }}
        />
      </View>
    </Sheet>
  );
}

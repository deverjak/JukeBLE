import { useState } from 'react';
import { Text, View } from 'react-native';

import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';
import type { AssignData } from '../../types';
import { fmtClock } from '../../utils/format';
import { Icon } from '../Icon';
import { Sheet } from '../Sheet';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge, Card, Radio, Row, SectionLabel, monoText } from '../ui/primitives';

/** Register a new card or remap an existing one: name + assigned sound. */
export function AssignSheet() {
  const { assign } = useJukebox();
  if (!assign) return null;
  // key remounts the form whenever a different card (or mode) opens the sheet
  return <AssignSheetInner key={`${assign.uid}:${assign.mode}`} data={assign} />;
}

function AssignSheetInner({ data }: { data: AssignData }) {
  const { tokens } = useTheme();
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
      label={isNew ? 'Nová karta' : 'Úprava karty'}
      title={isNew ? 'Registrovat kartu' : data.currentName || data.uid}>
      {/* UID strip */}
      <Card
        style={{
          paddingVertical: 12,
          paddingHorizontal: 14,
          marginBottom: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <Icon name="contactless" size={18} color={tokens.accentInk} />
        <Text style={[monoText(tokens.fg0, 13), { flex: 1 }]} numberOfLines={1}>
          {data.uid}
        </Text>
        <Badge>UID</Badge>
      </Card>

      <View style={{ marginBottom: 20 }}>
        <SectionLabel style={{ marginBottom: 8 }}>Název karty</SectionLabel>
        <Input value={name} onChangeText={setName} placeholder="např. Modrá karta" />
      </View>

      <SectionLabel
        style={{ marginBottom: 8 }}
        right={<Button small variant="ghost" icon="upload" label="Importovat" loading={importing} onPress={quickImport} />}>
        Přiřazený zvuk
      </SectionLabel>
      <Card style={{ overflow: 'hidden', marginBottom: 22 }}>
        <Row first onPress={() => setSoundId(null)}>
          <Radio on={soundId === null} />
          <Text style={{ flex: 1, fontFamily: fonts.sans.regular, fontSize: 15, color: tokens.fg1 }}>
            Žádný (přiřadit později)
          </Text>
        </Row>
        {sounds.map((s) => (
          <Row key={s.id} onPress={() => setSoundId(s.id)}>
            <Radio on={soundId === s.id} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={{ fontFamily: fonts.sans.medium, fontSize: 15, color: tokens.fg0 }}>
                {s.name}
              </Text>
              <Text style={[monoText(tokens.fg2), { marginTop: 2 }]}>
                {s.type} · {fmtClock(s.duration)}
              </Text>
            </View>
          </Row>
        ))}
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="ghost" label="Zrušit" onPress={closeAssign} style={{ flex: 1 }} />
        <Button
          icon="check"
          label={isNew ? 'Zaregistrovat' : 'Uložit'}
          disabled={!name.trim()}
          onPress={() => saveAssign({ uid: data.uid, name: name.trim(), soundId, isNew })}
          style={{ flex: 2 }}
        />
      </View>
    </Sheet>
  );
}

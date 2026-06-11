import { useState } from 'react';
import { View } from 'react-native';

import { useJukebox } from '../../state/JukeboxContext';
import type { RenameData } from '../../types';
import { Sheet } from '../Sheet';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function RenameSheet() {
  const { rename } = useJukebox();
  if (!rename) return null;
  return <RenameSheetInner key={rename.uid} data={rename} />;
}

function RenameSheetInner({ data }: { data: RenameData }) {
  const { closeRename, saveRename } = useJukebox();
  const [name, setName] = useState(data.name);

  return (
    <Sheet visible onClose={closeRename} label={data.uid} title="Přejmenovat kartu">
      <Input value={name} onChangeText={setName} autoFocus style={{ marginBottom: 22 }} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="ghost" label="Zrušit" onPress={closeRename} style={{ flex: 1 }} />
        <Button
          label="Uložit"
          disabled={!name.trim()}
          onPress={() => saveRename(data.uid, name.trim())}
          style={{ flex: 2 }}
        />
      </View>
    </Sheet>
  );
}

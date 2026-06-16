import Slider from '@react-native-community/slider';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { useJukebox } from '../../state/JukeboxContext';
import { useTheme } from '../../theme/ThemeContext';
import { fonts } from '../../theme/tokens';
import type { VolumeData } from '../../types';
import { Sheet } from '../Sheet';
import { Button } from '../ui/Button';
import { monoText } from '../ui/primitives';

export function VolumeSheet() {
  const { volumeEdit } = useJukebox();
  if (!volumeEdit) return null;
  return <VolumeSheetInner key={volumeEdit.id} data={volumeEdit} />;
}

function VolumeSheetInner({ data }: { data: VolumeData }) {
  const { tokens } = useTheme();
  const { closeVolume, saveVolume, previewSound, stopPlayback, setPreviewVolume, previewSoundId } = useJukebox();
  const [vol, setVol] = useState(data.volume);

  // Play the song while adjusting so the user can match levels by ear; stop on close.
  const started = useRef(false);
  useEffect(() => {
    if (!started.current && previewSoundId !== data.id) {
      previewSound(data.id);
      started.current = true;
    }
    return () => stopPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sheet visible onClose={closeVolume} label={data.name} title="Hlasitost">
      <View
        style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={monoText(tokens.fg3)}>ÚROVEŇ</Text>
        <Text style={{ fontFamily: fonts.mono.medium, fontSize: 26, letterSpacing: -0.5, color: tokens.fg0 }}>
          {Math.round(vol * 100)} %
        </Text>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={1}
        value={data.volume}
        onValueChange={(v) => {
          setVol(v);
          setPreviewVolume(v);
        }}
        minimumTrackTintColor={tokens.accent}
        maximumTrackTintColor={tokens.line2}
        thumbTintColor={tokens.accent}
        style={{ width: '100%', height: 40, marginBottom: 8 }}
      />
      <Text style={[monoText(tokens.fg3, 11.5), { marginBottom: 22, lineHeight: 17 }]}>
        Ztlumte hlasitější zvuky, aby všechny karty hrály podobně nahlas.
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="ghost" label="Zrušit" onPress={closeVolume} style={{ flex: 1 }} />
        <Button label="Uložit" onPress={() => saveVolume(data.id, vol)} style={{ flex: 2 }} />
      </View>
    </Sheet>
  );
}

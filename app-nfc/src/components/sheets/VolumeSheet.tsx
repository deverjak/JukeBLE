import Slider from '@react-native-community/slider';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { useT } from '../../i18n';
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
  const t = useT();
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
    <Sheet visible onClose={closeVolume} label={data.name} title={t.volume.title}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={monoText(tokens.textFaint)}>{t.volume.level}</Text>
        <Text style={{ fontFamily: fonts.display.bold, fontSize: 28, letterSpacing: -0.5, color: tokens.textStrong }}>
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
        minimumTrackTintColor={tokens.brand}
        maximumTrackTintColor={tokens.borderStrong}
        thumbTintColor={tokens.brand}
        style={{ width: '100%', height: 40, marginBottom: 8 }}
      />
      <Text style={[monoText(tokens.textFaint, 11.5), { marginBottom: 22, lineHeight: 18 }]}>{t.volume.hint}</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button variant="ghost" label={t.common.cancel} onPress={closeVolume} style={{ flex: 1 }} />
        <Button label={t.common.save} onPress={() => saveVolume(data.id, vol)} style={{ flex: 2 }} />
      </View>
    </Sheet>
  );
}

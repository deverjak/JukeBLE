/**
 * Sound library — import via the system document picker, copy into
 * <documentDirectory>/sounds/ (picker URIs are temporary), register in SQLite.
 */
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';

import type { Sound } from '../types';
import { probeDuration } from './audio';
import { deleteSoundRow, insertSound } from './database';

function soundsDir(): Directory {
  const dir = new Directory(Paths.document, 'sounds');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

export function soundFile(filePath: string): File {
  return new File(soundsDir(), filePath);
}

export function soundUri(filePath: string): string {
  return soundFile(filePath).uri;
}

export function soundFileExists(filePath: string): boolean {
  try {
    return soundFile(filePath).exists;
  } catch {
    return false;
  }
}

/**
 * Opens the picker and imports the selected audio files.
 * Returns the imported sounds ([] when the user cancels).
 */
export async function pickAndImportSounds(multiple: boolean): Promise<Sound[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    multiple,
    copyToCacheDirectory: true,
  });
  if (result.canceled) return [];

  const imported: Sound[] = [];
  for (const [index, asset] of result.assets.entries()) {
    const originalName = asset.name || 'zvuk';
    const dotAt = originalName.lastIndexOf('.');
    const ext = dotAt > 0 ? originalName.slice(dotAt + 1) : '';
    const baseRaw = dotAt > 0 ? originalName.slice(0, dotAt) : originalName;
    const base = baseRaw.replace(/[\\/:*?"<>|]/g, '').trim() || 'zvuk';

    const fileName = `${Date.now().toString(36)}${index}_${base}${ext ? `.${ext}` : ''}`;
    const dest = new File(soundsDir(), fileName);
    new File(asset.uri).copy(dest);

    const duration = await probeDuration(dest.uri);
    const type = (ext || asset.mimeType?.split('/')[1] || '').toUpperCase();
    const id = await insertSound(base, fileName, type, duration);
    imported.push({ id, name: base, filePath: fileName, type, duration, createdAt: new Date().toISOString() });
  }
  return imported;
}

/** Deletes the sound from disk and from the database (cards keep their UID, sound_id becomes NULL). */
export async function removeSound(sound: Sound): Promise<void> {
  try {
    const file = soundFile(sound.filePath);
    if (file.exists) file.delete();
  } catch {
    // missing file is fine — the DB row is the source of truth
  }
  await deleteSoundRow(sound.id);
}

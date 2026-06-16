/** Shared domain types for the JukeNFC app. */

export interface Sound {
  id: number;
  name: string;
  /** Relative file name inside <documentDirectory>/sounds/ (absolute URI changes between iOS updates). */
  filePath: string;
  /** Display format label, e.g. "MP3". */
  type: string;
  /** Duration in seconds (0 when unknown). */
  duration: number;
  /** Playback level 0..1 (1 = full/unchanged file level). */
  volume: number;
  createdAt: string;
}

export interface CardRow {
  /** Hex UID, e.g. "C0:7C:3C:52". */
  uid: string;
  name: string;
  soundId: number | null;
  createdAt: string;
}

export type Mode = 'play' | 'registration';

/**
 * NFC reader state. Unlike BLE there is no device to connect to — the phone's
 * own antenna reads tags, so the states describe the antenna/session instead:
 *   unsupported → device has no NFC hardware,
 *   disabled    → NFC is supported but turned off in system settings,
 *   idle        → NFC ready but not actively listening for taps,
 *   scanning    → actively listening for tag taps.
 */
export type NfcStatus = 'unsupported' | 'disabled' | 'idle' | 'scanning';

/** One line in the on-device NFC event log (diagnostics). */
export interface NfcLogEntry {
  /** HH:MM:SS when the event was recorded. */
  time: string;
  msg: string;
  level: 'info' | 'tag' | 'error';
}

export interface NowPlaying {
  soundId: number;
  /** UID of the card that triggered playback, or null for a library preview. */
  uid: string | null;
  name: string;
  duration: number;
  position: number;
  playing: boolean;
}

export type ToastTone = 'default' | 'ok' | 'warn' | 'error';

export interface ToastAction {
  label: string;
  kind: 'register' | 'assign';
  uid: string;
}

export interface ToastData {
  tone: ToastTone;
  msg: string;
  action?: ToastAction;
}

export interface AssignData {
  uid: string;
  mode: 'new' | 'remap';
  currentName: string;
  currentSoundId: number | null;
}

export interface RenameData {
  uid: string;
  name: string;
}

export interface VolumeData {
  id: number;
  name: string;
  /** Current level 0..1. */
  volume: number;
}

export interface ConfirmData {
  kind: 'sound' | 'card';
  id: number | string;
  title: string;
  body: string;
}

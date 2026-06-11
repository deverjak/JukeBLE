/** Shared domain types for the JukeBLE app. */

export interface Sound {
  id: number;
  name: string;
  /** Relative file name inside <documentDirectory>/sounds/ (absolute URI changes between iOS updates). */
  filePath: string;
  /** Display format label, e.g. "MP3". */
  type: string;
  /** Duration in seconds (0 when unknown). */
  duration: number;
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

export type ConnectionStatus =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'reconnecting'
  | 'connected';

export interface DeviceInfo {
  id: string;
  name: string | null;
  rssi: number | null;
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

export interface ConfirmData {
  kind: 'sound' | 'card';
  id: number | string;
  title: string;
  body: string;
}

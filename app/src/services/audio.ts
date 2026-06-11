/**
 * Playback — expo-audio. One sound at a time (jukebox behaviour):
 * a new card stops the current sound and starts the new one.
 */
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioStatus } from 'expo-audio';

export interface PlaybackStatus {
  position: number;
  duration: number;
  playing: boolean;
  finished: boolean;
}

type StatusListener = (status: PlaybackStatus) => void;

class AudioService {
  private player: AudioPlayer | null = null;
  private statusSub: { remove: () => void } | null = null;
  private listener: StatusListener | null = null;

  async init(): Promise<void> {
    try {
      await setAudioModeAsync({ playsInSilentMode: true });
    } catch {
      // non-fatal — playback still works with default audio mode
    }
  }

  setListener(listener: StatusListener | null): void {
    this.listener = listener;
  }

  play(uri: string): void {
    this.stop();
    const player = createAudioPlayer({ uri }, { updateInterval: 250 });
    this.player = player;
    this.statusSub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      this.listener?.({
        position: status.currentTime ?? 0,
        duration: status.duration ?? 0,
        playing: status.playing,
        finished: status.didJustFinish,
      });
    });
    player.play();
  }

  stop(): void {
    this.statusSub?.remove();
    this.statusSub = null;
    if (this.player) {
      try {
        this.player.remove();
      } catch {
        // player may already be released natively
      }
      this.player = null;
    }
  }
}

export const audio = new AudioService();

/** Reads the duration (s) of an audio file by loading it into a throwaway player. */
export function probeDuration(uri: string, timeoutMs = 4000): Promise<number> {
  return new Promise((resolve) => {
    let player: AudioPlayer | null = null;
    try {
      player = createAudioPlayer({ uri });
    } catch {
      resolve(0);
      return;
    }
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const done = (duration: number) => {
        clearInterval(timer);
        try {
          player?.remove();
        } catch {
          // ignore
        }
        resolve(duration);
      };
      if (player && player.isLoaded && player.duration > 0) done(player.duration);
      else if (Date.now() - startedAt > timeoutMs) done(0);
    }, 150);
  });
}

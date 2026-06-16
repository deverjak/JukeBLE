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
      await setAudioModeAsync({
        playsInSilentMode: true,
        // without this expo-audio pauses the active player when the app backgrounds
        shouldPlayInBackground: true,
        // lock-screen controls (needed for sustained Android background playback) require doNotMix
        interruptionMode: 'doNotMix',
      });
    } catch {
      // non-fatal — playback still works with default audio mode
    }
  }

  setListener(listener: StatusListener | null): void {
    this.listener = listener;
  }

  /** Adjust the volume of the currently-playing sound live (drag-to-preview). */
  setVolume(volume: number): void {
    if (this.player) {
      try {
        this.player.volume = Math.max(0, Math.min(1, volume));
      } catch {
        // player may already be released natively
      }
    }
  }

  play(uri: string, title?: string, volume = 1): void {
    this.stop();
    const player = createAudioPlayer({ uri }, { updateInterval: 250 });
    this.player = player;
    player.volume = Math.max(0, Math.min(1, volume));
    this.statusSub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      this.listener?.({
        position: status.currentTime ?? 0,
        duration: status.duration ?? 0,
        playing: status.playing,
        finished: status.didJustFinish,
      });
    });
    player.play();
    // Android stops background audio after ~3 min unless the player owns the
    // lock-screen media session (runs the mediaPlayback foreground service)
    try {
      player.setActiveForLockScreen(true, { title: title ?? 'JukeNFC' }, { showSeekForward: false, showSeekBackward: false });
    } catch {
      // builds without the AudioControlsService can't activate the media session
    }
  }

  stop(): void {
    this.statusSub?.remove();
    this.statusSub = null;
    if (this.player) {
      try {
        this.player.clearLockScreenControls();
      } catch {
        // player may already be released natively
      }
      // remove() only releases the JS object — without pause() the native
      // player keeps playing in the background
      try {
        this.player.pause();
      } catch {
        // player may already be released natively
      }
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

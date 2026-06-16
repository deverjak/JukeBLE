/**
 * Global app state — the "mode router" from the architecture doc.
 * Receives UIDs from the NFC reader and dispatches by mode:
 *   registration → open the assign sheet (new card or remap),
 *   play         → look up the card and play its sound.
 */
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { audio } from '../services/audio';
import { nfc } from '../services/nfc';
import {
  deleteCardRow,
  listCards,
  listSounds,
  renameCard,
  updateSoundVolume,
  upsertCard,
} from '../services/database';
import { pickAndImportSounds, removeSound, soundFileExists, soundUri } from '../services/library';
import { getSavedFlag, setSavedFlag } from '../services/settings';
import { fmt, useT } from '../i18n';
import type {
  AssignData,
  CardRow,
  ConfirmData,
  Mode,
  NfcLogEntry,
  NfcStatus,
  NowPlaying,
  RenameData,
  Sound,
  ToastAction,
  ToastData,
  VolumeData,
} from '../types';

interface JukeboxValue {
  ready: boolean;

  mode: Mode;
  setMode: (mode: Mode) => void;

  nfcStatus: NfcStatus;
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  openNfcSettings: () => Promise<void>;
  nfcLog: NfcLogEntry[];
  clearNfcLog: () => void;

  sounds: Sound[];
  cards: CardRow[];

  nowPlaying: NowPlaying | null;
  lastUid: string | null;
  previewSoundId: number | null;
  previewUid: string | null;
  previewSound: (soundId: number) => void;
  previewCard: (card: CardRow) => void;
  stopPlayback: () => void;

  keepAwake: boolean;
  setKeepAwake: (v: boolean) => void;
  autoResume: boolean;
  setAutoResume: (v: boolean) => void;

  toast: ToastData | null;
  dismissToast: () => void;
  onToastAction: (action: ToastAction) => void;

  assign: AssignData | null;
  openAssign: (data: AssignData) => void;
  closeAssign: () => void;
  saveAssign: (input: { uid: string; name: string; soundId: number | null; isNew: boolean }) => Promise<void>;

  rename: RenameData | null;
  openRename: (data: RenameData) => void;
  closeRename: () => void;
  saveRename: (uid: string, name: string) => Promise<void>;

  cardAction: CardRow | null;
  openCardAction: (card: CardRow) => void;
  closeCardAction: () => void;

  volumeEdit: VolumeData | null;
  openVolume: (sound: Sound) => void;
  closeVolume: () => void;
  saveVolume: (id: number, volume: number) => Promise<void>;
  /** Live drag-to-preview — sets the volume of the currently playing sound. */
  setPreviewVolume: (volume: number) => void;

  confirm: ConfirmData | null;
  askDeleteSound: (sound: Sound) => void;
  askDeleteCard: (card: CardRow) => void;
  closeConfirm: () => void;
  runConfirm: () => Promise<void>;

  importing: boolean;
  importToLibrary: () => Promise<void>;
  importSingleSound: () => Promise<number | null>;

  /** DEV simulator — feeds a UID into the same pipeline as an NFC tag tap. */
  simulateUid: (uid: string) => void;
}

const JukeboxContext = createContext<JukeboxValue | null>(null);

export function JukeboxProvider({ children }: { children: ReactNode }) {
  const t = useT();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>('play');
  const [nfcStatus, setNfcStatus] = useState<NfcStatus>('idle');
  const [nfcLog, setNfcLog] = useState<NfcLogEntry[]>([]);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [lastUid, setLastUid] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [assign, setAssign] = useState<AssignData | null>(null);
  const [rename, setRename] = useState<RenameData | null>(null);
  const [volumeEdit, setVolumeEdit] = useState<VolumeData | null>(null);
  const [cardAction, setCardAction] = useState<CardRow | null>(null);
  const [confirm, setConfirm] = useState<ConfirmData | null>(null);
  const [importing, setImporting] = useState(false);
  const [keepAwake, setKeepAwakeState] = useState(() => getSavedFlag('keepAwake', false));
  const [autoResume, setAutoResumeState] = useState(() => getSavedFlag('autoResume', true));

  /* Refs so the long-lived NFC callback always sees current state. */
  const modeRef = useRef(mode);
  const soundsRef = useRef(sounds);
  const cardsRef = useRef(cards);
  const nowPlayingRef = useRef(nowPlaying);
  const tRef = useRef(t);
  const autoResumeRef = useRef(autoResume);
  useEffect(() => {
    tRef.current = t;
  }, [t]);
  useEffect(() => {
    autoResumeRef.current = autoResume;
  }, [autoResume]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    soundsRef.current = sounds;
  }, [sounds]);
  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);
  useEffect(() => {
    nowPlayingRef.current = nowPlaying;
  }, [nowPlaying]);

  /* ── Toast ──────────────────────────────────────────────── */

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fireToast = useCallback((data: ToastData) => {
    setToast(data);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), data.action ? 6000 : 3500);
  }, []);
  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(null);
  }, []);

  /* ── Library / cards data ───────────────────────────────── */

  const refreshSounds = useCallback(async () => {
    setSounds(await listSounds());
  }, []);
  const refreshCards = useCallback(async () => {
    setCards(await listCards());
  }, []);

  /* ── Playback ───────────────────────────────────────────── */

  const startPlayback = useCallback((sound: Sound, uid: string | null) => {
    audio.play(soundUri(sound.filePath), sound.name, sound.volume);
    setNowPlaying({
      soundId: sound.id,
      uid,
      name: sound.name,
      duration: sound.duration,
      position: 0,
      playing: true,
    });
  }, []);

  const stopPlayback = useCallback(() => {
    audio.stop();
    setNowPlaying(null);
  }, []);

  const previewSoundId =
    nowPlaying && nowPlaying.uid === null && nowPlaying.playing ? nowPlaying.soundId : null;
  const previewUid = nowPlaying && nowPlaying.uid && nowPlaying.playing ? nowPlaying.uid : null;

  const previewSound = useCallback(
    (soundId: number) => {
      const current = nowPlayingRef.current;
      if (current && current.uid === null && current.soundId === soundId && current.playing) {
        stopPlayback();
        return;
      }
      const sound = soundsRef.current.find((s) => s.id === soundId);
      if (!sound) return;
      if (!soundFileExists(sound.filePath)) {
        fireToast({ tone: 'error', msg: tRef.current.toast.soundFileMissingDisk });
        return;
      }
      startPlayback(sound, null);
    },
    [fireToast, startPlayback, stopPlayback]
  );

  const previewCard = useCallback(
    (card: CardRow) => {
      const current = nowPlayingRef.current;
      if (current && current.uid === card.uid && current.playing) {
        stopPlayback();
        return;
      }
      if (!card.soundId) {
        fireToast({
          tone: 'warn',
          msg: fmt(tRef.current.toast.noSoundOnCard, { name: card.name }),
          action: { label: tRef.current.toast.actionAssign, kind: 'assign', uid: card.uid },
        });
        return;
      }
      const sound = soundsRef.current.find((s) => s.id === card.soundId);
      if (!sound || !soundFileExists(sound.filePath)) {
        fireToast({
          tone: 'error',
          msg: tRef.current.toast.soundFileMissing,
          action: { label: tRef.current.toast.actionRemap, kind: 'assign', uid: card.uid },
        });
        return;
      }
      startPlayback(sound, card.uid);
    },
    [fireToast, startPlayback, stopPlayback]
  );

  /* ── UID dispatch (the mode router) ─────────────────────── */

  const handleUid = useCallback(
    (uid: string) => {
      setLastUid(uid);
      const card = cardsRef.current.find((c) => c.uid === uid);

      if (modeRef.current === 'registration') {
        setAssign({
          uid,
          mode: card ? 'remap' : 'new',
          currentName: card?.name ?? '',
          currentSoundId: card?.soundId ?? null,
        });
        return;
      }

      // play mode
      if (!card) {
        fireToast({
          tone: 'error',
          msg: fmt(tRef.current.toast.unknownCard, { uid }),
          action: { label: tRef.current.toast.actionRegister, kind: 'register', uid },
        });
        return;
      }
      if (!card.soundId) {
        fireToast({
          tone: 'warn',
          msg: fmt(tRef.current.toast.noSoundOnCard, { name: card.name }),
          action: { label: tRef.current.toast.actionAssign, kind: 'assign', uid },
        });
        return;
      }
      const sound = soundsRef.current.find((s) => s.id === card.soundId);
      if (!sound || !soundFileExists(sound.filePath)) {
        fireToast({
          tone: 'error',
          msg: tRef.current.toast.soundFileMissing,
          action: { label: tRef.current.toast.actionRemap, kind: 'assign', uid },
        });
        return;
      }
      // same card while its sound is still playing → ignore (debounce safety net)
      const current = nowPlayingRef.current;
      if (current && current.uid === uid && current.soundId === sound.id && current.playing) return;
      startPlayback(sound, uid);
    },
    [fireToast, startPlayback]
  );

  const onToastAction = useCallback(
    (action: ToastAction) => {
      dismissToast();
      const card = cardsRef.current.find((c) => c.uid === action.uid);
      if (action.kind === 'register') {
        setMode('registration');
        router.navigate('/');
        setAssign({ uid: action.uid, mode: 'new', currentName: '', currentSoundId: null });
      } else {
        router.navigate('/');
        setAssign({
          uid: action.uid,
          mode: 'remap',
          currentName: card?.name ?? '',
          currentSoundId: card?.soundId ?? null,
        });
      }
    },
    [dismissToast]
  );

  /* ── Init: audio mode, DB, NFC wiring, auto-start ───────── */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await audio.init();
      await Promise.all([refreshSounds(), refreshCards()]);
      if (cancelled) return;
      setReady(true);
      await nfc.init({
        onStatusChange: setNfcStatus,
        onUid: handleUid,
        onError: (msg) => fireToast({ tone: 'error', msg }),
        onLog: (entry) => setNfcLog((prev) => [entry, ...prev].slice(0, 60)),
      });
      nfc.tryAutoStart();
    })();

    // Android only reads NFC while the app is foregrounded, so re-arm the reader
    // on resume and release the antenna when the app leaves the foreground.
    const appStateSub = AppState.addEventListener('change', (next) => {
      nfc.note(`AppState → ${next}`);
      if (next === 'active') {
        if (autoResumeRef.current) void nfc.startScan();
      } else void nfc.stopScan();
    });

    return () => {
      cancelled = true;
      appStateSub.remove();
      nfc.destroy();
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Keep the screen awake while listening (kiosk) — NFC stops the moment the
     screen sleeps, so an unattended jukebox must not lock itself out. Opt-in. */
  useEffect(() => {
    if (nfcStatus !== 'scanning' || !keepAwake) return;
    void activateKeepAwakeAsync('jukenfc-nfc');
    return () => {
      void deactivateKeepAwake('jukenfc-nfc');
    };
  }, [nfcStatus, keepAwake]);

  /* Playback progress from the audio player. */
  useEffect(() => {
    audio.setListener((status) => {
      setNowPlaying((np) => {
        if (!np) return np;
        if (status.finished) {
          return { ...np, position: np.duration || status.duration || np.position, playing: false };
        }
        return {
          ...np,
          position: status.position,
          duration: status.duration > 0 ? status.duration : np.duration,
          playing: status.playing,
        };
      });
    });
    return () => audio.setListener(null);
  }, []);

  /* ── NFC scan actions ───────────────────────────────────── */

  const startScan = useCallback(async () => {
    await nfc.startScan();
  }, []);

  const stopScan = useCallback(async () => {
    await nfc.stopScan();
  }, []);

  const openNfcSettings = useCallback(async () => {
    await nfc.openSettings();
  }, []);

  const clearNfcLog = useCallback(() => setNfcLog([]), []);

  const setKeepAwake = useCallback((v: boolean) => {
    setSavedFlag('keepAwake', v);
    setKeepAwakeState(v);
  }, []);
  const setAutoResume = useCallback((v: boolean) => {
    setSavedFlag('autoResume', v);
    setAutoResumeState(v);
  }, []);

  /* ── Assign / rename / delete ───────────────────────────── */

  const saveAssign = useCallback(
    async ({ uid, name, soundId, isNew }: { uid: string; name: string; soundId: number | null; isNew: boolean }) => {
      await upsertCard(uid, name, soundId);
      await refreshCards();
      setAssign(null);
      fireToast({ tone: 'ok', msg: isNew ? tRef.current.toast.cardRegistered : tRef.current.toast.changesSaved });
    },
    [fireToast, refreshCards]
  );

  const saveRename = useCallback(
    async (uid: string, name: string) => {
      await renameCard(uid, name);
      await refreshCards();
      setRename(null);
      fireToast({ tone: 'ok', msg: tRef.current.toast.renamed });
    },
    [fireToast, refreshCards]
  );

  /* ── Per-song volume ────────────────────────────────────── */

  const openVolume = useCallback((sound: Sound) => {
    setVolumeEdit({ id: sound.id, name: sound.name, volume: sound.volume });
  }, []);

  const setPreviewVolume = useCallback((volume: number) => {
    audio.setVolume(volume);
  }, []);

  const saveVolume = useCallback(
    async (id: number, volume: number) => {
      await updateSoundVolume(id, volume);
      await refreshSounds();
      setVolumeEdit(null);
      fireToast({ tone: 'ok', msg: tRef.current.toast.volumeSaved });
    },
    [fireToast, refreshSounds]
  );

  const openCardAction = useCallback((card: CardRow) => setCardAction(card), []);
  const closeCardAction = useCallback(() => setCardAction(null), []);

  const askDeleteSound = useCallback(
    (sound: Sound) => {
      setConfirm({
        kind: 'sound',
        id: sound.id,
        title: tRef.current.confirm.deleteSoundTitle,
        body: fmt(tRef.current.confirm.deleteSoundBody, { name: sound.name }),
      });
    },
    []
  );

  const askDeleteCard = useCallback((card: CardRow) => {
    setConfirm({
      kind: 'card',
      id: card.uid,
      title: tRef.current.confirm.deleteCardTitle,
      body: fmt(tRef.current.confirm.deleteCardBody, { uid: card.uid }),
    });
  }, []);

  const runConfirm = useCallback(async () => {
    if (!confirm) return;
    if (confirm.kind === 'sound') {
      const sound = soundsRef.current.find((s) => s.id === confirm.id);
      const current = nowPlayingRef.current;
      if (current && current.soundId === confirm.id) stopPlayback();
      if (sound) await removeSound(sound);
      await Promise.all([refreshSounds(), refreshCards()]);
      fireToast({ tone: 'default', msg: tRef.current.toast.soundDeleted });
    } else {
      await deleteCardRow(String(confirm.id));
      await refreshCards();
      fireToast({ tone: 'default', msg: tRef.current.toast.cardDeleted });
    }
    setConfirm(null);
  }, [confirm, fireToast, refreshCards, refreshSounds, stopPlayback]);

  /* ── Import ─────────────────────────────────────────────── */

  const importToLibrary = useCallback(async () => {
    setImporting(true);
    try {
      const imported = await pickAndImportSounds(true);
      if (imported.length > 0) {
        await refreshSounds();
        fireToast({
          tone: 'ok',
          msg:
            imported.length === 1
              ? fmt(tRef.current.toast.addedOne, { name: imported[0].name })
              : fmt(tRef.current.toast.addedMany, { n: imported.length }),
        });
      }
    } catch {
      fireToast({ tone: 'error', msg: tRef.current.toast.importFailed });
    } finally {
      setImporting(false);
    }
  }, [fireToast, refreshSounds]);

  const importSingleSound = useCallback(async (): Promise<number | null> => {
    try {
      const imported = await pickAndImportSounds(false);
      if (imported.length === 0) return null;
      await refreshSounds();
      fireToast({ tone: 'ok', msg: fmt(tRef.current.toast.addedOne, { name: imported[0].name }) });
      return imported[0].id;
    } catch {
      fireToast({ tone: 'error', msg: tRef.current.toast.importFailed });
      return null;
    }
  }, [fireToast, refreshSounds]);

  /* ── Context value ──────────────────────────────────────── */

  const value = useMemo<JukeboxValue>(
    () => ({
      ready,
      mode,
      setMode,
      nfcStatus,
      startScan,
      stopScan,
      openNfcSettings,
      nfcLog,
      clearNfcLog,
      sounds,
      cards,
      nowPlaying,
      lastUid,
      previewSoundId,
      previewUid,
      previewSound,
      previewCard,
      stopPlayback,
      keepAwake,
      setKeepAwake,
      autoResume,
      setAutoResume,
      toast,
      dismissToast,
      onToastAction,
      assign,
      openAssign: setAssign,
      closeAssign: () => setAssign(null),
      saveAssign,
      rename,
      openRename: setRename,
      closeRename: () => setRename(null),
      saveRename,
      cardAction,
      openCardAction,
      closeCardAction,
      volumeEdit,
      openVolume,
      closeVolume: () => setVolumeEdit(null),
      saveVolume,
      setPreviewVolume,
      confirm,
      askDeleteSound,
      askDeleteCard,
      closeConfirm: () => setConfirm(null),
      runConfirm,
      importing,
      importToLibrary,
      importSingleSound,
      simulateUid: handleUid,
    }),
    [
      ready,
      mode,
      nfcStatus,
      startScan,
      stopScan,
      openNfcSettings,
      nfcLog,
      clearNfcLog,
      sounds,
      cards,
      nowPlaying,
      lastUid,
      previewSoundId,
      previewUid,
      previewSound,
      previewCard,
      stopPlayback,
      keepAwake,
      setKeepAwake,
      autoResume,
      setAutoResume,
      toast,
      dismissToast,
      onToastAction,
      assign,
      saveAssign,
      rename,
      saveRename,
      cardAction,
      openCardAction,
      closeCardAction,
      volumeEdit,
      openVolume,
      saveVolume,
      setPreviewVolume,
      confirm,
      askDeleteSound,
      askDeleteCard,
      runConfirm,
      importing,
      importToLibrary,
      importSingleSound,
      handleUid,
    ]
  );

  return <JukeboxContext.Provider value={value}>{children}</JukeboxContext.Provider>;
}

export function useJukebox(): JukeboxValue {
  const ctx = useContext(JukeboxContext);
  if (!ctx) throw new Error('useJukebox must be used within JukeboxProvider');
  return ctx;
}

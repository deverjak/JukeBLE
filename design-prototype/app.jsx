/* JukeBLE — main app: state, routing, interactions, modals. */

const { useState: uS, useEffect: uE, useRef: uR } = React;

/* ── seed data ────────────────────────────────────────────── */
const SEED_SOUNDS = [
  { id: 1, name: 'Fanfára', dur: 6, type: 'MP3' },
  { id: 2, name: 'Smích publika', dur: 4, type: 'WAV' },
  { id: 3, name: 'Bubnová předehra', dur: 9, type: 'MP3' },
  { id: 4, name: 'Potlesk', dur: 11, type: 'M4A' },
  { id: 5, name: 'Zvonek', dur: 2, type: 'WAV' },
];
const SEED_CARDS = [
  { uid: 'C0:7C:3C:52', name: 'Modrá karta', soundId: 1 },
  { uid: 'A3:1F:88:0D', name: 'Žetón A', soundId: 2 },
  { uid: '04:E2:9A:7B:55:30:80', name: 'Klíčenka (NTAG)', soundId: 4 },
  { uid: '9F:22:10:C4', name: 'Červená karta', soundId: null },
];
const IMPORT_NAMES = ['Cinknutí', 'Exploze', 'Kvák', 'Tadá', 'Pískot', 'Gong'];

/* ════════════════ Assign / remap sheet ═══════════════════ */
function AssignSheet({ data, sounds, onSave, onClose, onQuickImport }) {
  const [name, setName] = uS(data ? data.currentName : '');
  const [soundId, setSoundId] = uS(data ? data.currentSoundId : null);
  uE(() => { if (data) { setName(data.currentName); setSoundId(data.currentSoundId); } }, [data && data.uid]);
  if (!data) return null;
  const isNew = data.mode === 'new';
  return (
    <Sheet open onClose={onClose} label={isNew ? 'Nová karta' : 'Úprava karty'} title={isNew ? 'Registrovat kartu' : data.currentName}>
      <div className="jb-card" style={{ padding: '12px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Icon name="contactless" size={18} style={{ color: 'var(--accent-ink)' }} />
        <span className="jb-mono" style={{ fontSize: 13, color: 'var(--fg-0)' }}>{data.uid}</span>
        <span className="jb-badge" style={{ marginLeft: 'auto' }}>UID</span>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label className="jb-label" style={{ display: 'block', marginBottom: 8 }}>Název karty</label>
        <input className="jb-input" value={name} placeholder="např. Modrá karta" onChange={e => setName(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="jb-label">Přiřazený zvuk</span>
        <button className="jb-btn jb-btn-ghost" style={{ padding: '6px 8px', fontSize: 12 }} onClick={onQuickImport}>
          <Icon name="upload" size={14} /> Importovat
        </button>
      </div>
      <div className="jb-card" style={{ overflow: 'hidden', marginBottom: 22 }}>
        <button className="jb-row jb-row-tap" style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }} onClick={() => setSoundId(null)}>
          <Radio on={soundId === null} />
          <span style={{ flex: 1, fontSize: 15, color: 'var(--fg-1)' }}>Žádný (přiřadit později)</span>
        </button>
        {sounds.map(s => (
          <button key={s.id} className="jb-row jb-row-tap" style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }} onClick={() => setSoundId(s.id)}>
            <Radio on={soundId === s.id} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 500, display: 'block' }}>{s.name}</span>
              <span className="jb-mono" style={{ fontSize: 11, color: 'var(--fg-2)' }}>{s.type} · {fmtClock(s.dur)}</span>
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="jb-btn jb-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Zrušit</button>
        <button className="jb-btn jb-btn-primary" style={{ flex: 2 }} disabled={!name.trim()} onClick={() => onSave({ uid: data.uid, name: name.trim(), soundId, isNew })}>
          <Icon name="check" size={17} /> {isNew ? 'Zaregistrovat' : 'Uložit'}
        </button>
      </div>
    </Sheet>
  );
}

function Radio({ on }) {
  return (
    <span style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      border: '1.5px solid ' + (on ? 'var(--accent)' : 'var(--line-2)'),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {on && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />}
    </span>
  );
}

/* ════════════════ Rename sheet ═══════════════════════════ */
function RenameSheet({ data, onSave, onClose }) {
  const [name, setName] = uS(data ? data.name : '');
  uE(() => { if (data) setName(data.name); }, [data && data.uid]);
  if (!data) return null;
  return (
    <Sheet open onClose={onClose} label={data.uid} title="Přejmenovat kartu">
      <input className="jb-input" autoFocus value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 22 }} />
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="jb-btn jb-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Zrušit</button>
        <button className="jb-btn jb-btn-primary" style={{ flex: 2 }} disabled={!name.trim()} onClick={() => onSave(data.uid, name.trim())}>Uložit</button>
      </div>
    </Sheet>
  );
}

/* ════════════════ Confirm sheet ══════════════════════════ */
function ConfirmSheet({ data, onConfirm, onClose }) {
  if (!data) return null;
  return (
    <Sheet open onClose={onClose} label="Potvrzení" title={data.title}>
      <p style={{ fontSize: 14.5, color: 'var(--fg-1)', lineHeight: 1.5, marginBottom: 22 }}>{data.body}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="jb-btn jb-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Zrušit</button>
        <button className="jb-btn jb-btn-danger" style={{ flex: 1, borderColor: 'var(--error)' }} onClick={onConfirm}>
          <Icon name="trash" size={16} /> Smazat
        </button>
      </div>
    </Sheet>
  );
}

/* ════════════════════════ APP ════════════════════════════ */
function App() {
  const [theme, setTheme] = uS('dark');
  const [tab, setTab] = uS('home');
  const [pairingOpen, setPairingOpen] = uS(false);

  const [connected, setConnected] = uS(true);
  const [device, setDevice] = uS({ name: 'RFID-Jukebox', id: 'C8:2B:96:1A:4F:30', rssi: -58 });
  const [mode, setMode] = uS('play');

  const [sounds, setSounds] = uS(SEED_SOUNDS);
  const [cards, setCards] = uS(SEED_CARDS);
  const [nowPlaying, setNowPlaying] = uS(null);
  const [lastUid, setLastUid] = uS('C0:7C:3C:52');

  const [toast, setToast] = uS(null);
  const [scanning, setScanning] = uS(false);
  const [found, setFound] = uS([]);
  const [connectingId, setConnectingId] = uS(null);
  const [importing, setImporting] = uS(false);

  const [assign, setAssign] = uS(null);
  const [rename, setRename] = uS(null);
  const [confirm, setConfirm] = uS(null);

  const soundById = (id) => sounds.find(s => s.id === id);
  const cardByUid = (uid) => cards.find(c => c.uid === uid);

  /* progress timer */
  uE(() => {
    if (!nowPlaying || !nowPlaying.playing) return;
    const t = setInterval(() => {
      setNowPlaying(np => {
        if (!np || !np.playing) return np;
        const e = np.elapsed + 0.25;
        if (e >= np.dur) return { ...np, elapsed: np.dur, playing: false };
        return { ...np, elapsed: e };
      });
    }, 250);
    return () => clearInterval(t);
  }, [nowPlaying && nowPlaying.playing, nowPlaying && nowPlaying.soundId, nowPlaying && nowPlaying.uid]);

  /* toast auto-dismiss */
  const toastTimer = uR(null);
  const fireToast = (t) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), t.action ? 6000 : 3500);
  };

  const playSound = (soundId, uid) => {
    const s = soundById(soundId);
    if (!s) return;
    setNowPlaying({ soundId, uid, elapsed: 0, dur: s.dur, playing: true });
  };

  const previewId = (nowPlaying && nowPlaying.uid === null && nowPlaying.playing) ? nowPlaying.soundId : null;

  /* ── core: simulated card tap ─────────────────────────── */
  const simTap = (uid) => {
    setLastUid(uid);
    if (mode === 'registration') {
      const c = cardByUid(uid);
      setAssign({ uid, mode: c ? 'remap' : 'new', currentName: c ? c.name : '', currentSoundId: c ? c.soundId : null });
      return;
    }
    // play mode
    const c = cardByUid(uid);
    if (!c) { fireToast({ tone: 'error', msg: 'Neznámá karta ' + uid, action: { label: 'Registrovat', kind: 'register', uid } }); return; }
    if (!c.soundId) { fireToast({ tone: 'warn', msg: 'Karta „' + c.name + '" nemá přiřazený zvuk', action: { label: 'Přiřadit', kind: 'assign', uid } }); return; }
    const s = soundById(c.soundId);
    if (!s) { fireToast({ tone: 'error', msg: 'Zvukový soubor chybí', action: { label: 'Přemapovat', kind: 'assign', uid } }); return; }
    playSound(c.soundId, uid);
  };

  const onToastAction = (action) => {
    setToast(null);
    const c = cardByUid(action.uid);
    if (action.kind === 'register') { setMode('registration'); setTab('home'); setAssign({ uid: action.uid, mode: 'new', currentName: '', currentSoundId: null }); }
    else if (action.kind === 'assign') { setTab('home'); setAssign({ uid: action.uid, mode: 'remap', currentName: c ? c.name : '', currentSoundId: c ? c.soundId : null }); }
  };

  /* ── assign save ──────────────────────────────────────── */
  const saveAssign = ({ uid, name, soundId, isNew }) => {
    setCards(prev => {
      const exists = prev.some(c => c.uid === uid);
      if (exists) return prev.map(c => c.uid === uid ? { ...c, name, soundId } : c);
      return [...prev, { uid, name, soundId }];
    });
    setAssign(null);
    fireToast({ tone: 'ok', msg: isNew ? 'Karta zaregistrována' : 'Změny uloženy' });
  };

  /* ── pairing ──────────────────────────────────────────── */
  const startScan = () => {
    setScanning(true); setFound([]);
    const seq = [
      { id: 'C8:2B:96:1A:4F:30', name: 'RFID-Jukebox', rssi: -57, target: true, delay: 700 },
      { id: '5E:11:A0:3C:7D:91', name: 'Bezejmenné zařízení', rssi: -74, delay: 1300 },
      { id: '12:88:FE:0B:22:A4', name: 'Mi Smart Band 8', rssi: -81, delay: 1900 },
    ];
    seq.forEach(d => setTimeout(() => setFound(f => [...f, d]), d.delay));
    setTimeout(() => setScanning(false), 2400);
  };
  const connectDevice = (d) => {
    setConnectingId(d.id);
    setTimeout(() => {
      setConnected(true); setDevice({ name: d.name, id: d.id, rssi: d.rssi });
      setConnectingId(null); setScanning(false); setFound([]); setPairingOpen(false);
      fireToast({ tone: 'ok', msg: 'Připojeno k ' + d.name });
    }, 1100);
  };
  const disconnect = () => {
    setConnected(false); setNowPlaying(null);
    fireToast({ tone: 'default', msg: 'Čtečka odpojena' });
  };

  /* ── library ──────────────────────────────────────────── */
  const importSound = (cb) => {
    setImporting(true);
    setTimeout(() => {
      const n = IMPORT_NAMES[sounds.length % IMPORT_NAMES.length];
      const id = Date.now();
      const ns = { id, name: n, dur: 2 + Math.floor(Math.random() * 9), type: ['MP3', 'WAV', 'M4A'][Math.floor(Math.random() * 3)] };
      setSounds(prev => [...prev, ns]);
      setImporting(false);
      fireToast({ tone: 'ok', msg: '„' + n + '" přidáno do knihovny' });
      if (cb) cb(id);
    }, 1100);
  };
  const previewSound = (id) => {
    if (previewId === id) { setNowPlaying(null); return; }
    playSound(id, null);
  };
  const askDeleteSound = (s) => setConfirm({ kind: 'sound', item: s, title: 'Smazat zvuk?', body: '„' + s.name + '" bude odebrán z knihovny. Karty s tímto zvukem zůstanou bez přiřazení.' });
  const askDeleteCard = (c) => setConfirm({ kind: 'card', item: c, title: 'Smazat kartu?', body: 'Registrace karty ' + c.uid + ' bude odstraněna. Zvuky v knihovně zůstanou.' });
  const doConfirm = () => {
    if (confirm.kind === 'sound') { setSounds(prev => prev.filter(s => s.id !== confirm.item.id)); fireToast({ tone: 'default', msg: 'Zvuk smazán' }); }
    else { setCards(prev => prev.filter(c => c.uid !== confirm.item.uid)); fireToast({ tone: 'default', msg: 'Karta smazána' }); }
    setConfirm(null);
  };

  const simCards = [
    ...cards.map(c => ({ uid: c.uid, label: c.name.length > 12 ? c.name.slice(0, 11) + '…' : c.name })),
    { uid: 'DE:AD:BE:EF', label: 'Neznámá', unknown: true },
  ];

  const headerByTab = {
    home: { title: 'Přehrávač', sub: 'RFID JUKEBOX' },
    cards: { title: 'Karty', sub: 'MAPOVÁNÍ UID → ZVUK' },
    library: { title: 'Knihovna', sub: 'ZVUKOVÉ SOUBORY' },
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  let screen;
  if (tab === 'home') screen = <HomeScreen {...{ connected, device, mode, setMode, nowPlaying, lastUid, soundById, cardByUid, simCards, onSimTap: simTap, onStop: () => setNowPlaying(null), onOpenPairing: () => setPairingOpen(true) }} />;
  else if (tab === 'cards') screen = <CardsScreen {...{ cards, soundById, onRename: (c) => setRename({ uid: c.uid, name: c.name }), onRemap: (c) => setAssign({ uid: c.uid, mode: 'remap', currentName: c.name, currentSoundId: c.soundId }), onDeleteCard: askDeleteCard, mode, setMode, setTab }} />;
  else screen = <LibraryScreen {...{ sounds, cards, onImport: () => importSound(), importing, onPreview: previewSound, previewId, onDeleteSound: askDeleteSound }} />;

  return (
    <PhoneFrame theme={theme}>
      {pairingOpen ? (
        <AppHeader theme={theme} onToggleTheme={toggleTheme} connected={connected} onOpenPairing={() => {}}
          title="Párování" sub="BLE LINK"
          left={<button className="jb-iconbtn" onClick={() => setPairingOpen(false)} style={{ border: '1px solid var(--line-1)' }}><Icon name="chevron-left" size={20} /></button>} />
      ) : (
        <AppHeader theme={theme} onToggleTheme={toggleTheme} connected={connected} onOpenPairing={() => setPairingOpen(true)}
          title={headerByTab[tab].title} sub={headerByTab[tab].sub} />
      )}

      {pairingOpen
        ? <PairingScreen {...{ connected, device, scanning, found, connectingId, onScan: startScan, onConnect: connectDevice, onDisconnect: disconnect, onClose: () => setPairingOpen(false) }} />
        : screen}

      {!pairingOpen && <BottomTabs active={tab} onChange={setTab} />}

      <Toast toast={toast} onAction={onToastAction} />

      <AssignSheet data={assign} sounds={sounds} onClose={() => setAssign(null)} onSave={saveAssign}
        onQuickImport={() => importSound((id) => setAssign(a => a ? { ...a, currentSoundId: id } : a))} />
      <RenameSheet data={rename} onClose={() => setRename(null)} onSave={(uid, name) => { setCards(prev => prev.map(c => c.uid === uid ? { ...c, name } : c)); setRename(null); fireToast({ tone: 'ok', msg: 'Přejmenováno' }); }} />
      <ConfirmSheet data={confirm} onClose={() => setConfirm(null)} onConfirm={doConfirm} />
    </PhoneFrame>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

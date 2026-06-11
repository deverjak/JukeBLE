/* JukeBLE — screens + modals. Exported to window. */

const fmtClock = (s) => {
  s = Math.max(0, Math.round(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};

/* ── Section label ────────────────────────────────────────── */
function SectionLabel({ children, right, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 10px', ...style }}>
      <span className="jb-label">{children}</span>
      {right}
    </div>
  );
}

function ConsoleRow({ k, children }) {
  return (
    <div className="jb-console-row">
      <span className="k">{k}</span>
      <span className="v">{children}</span>
    </div>
  );
}

/* ════════════════════ HOME / NOW PLAYING ════════════════════ */
function HomeScreen(p) {
  const { connected, device, mode, setMode, nowPlaying, lastUid, soundById, cardByUid,
          simCards, onSimTap, onStop, onOpenPairing } = p;
  const sound = nowPlaying ? soundById(nowPlaying.soundId) : null;
  const npCard = nowPlaying && nowPlaying.uid ? cardByUid(nowPlaying.uid) : null;

  return (
    <div className="jb-body jb-screen-in" key={mode + String(connected)}>
      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Mode switch */}
        <div>
          <SectionLabel>Provozní mód</SectionLabel>
          <div className="jb-seg">
            <button className={'jb-seg-opt' + (mode === 'registration' ? ' is-active' : '')}
              onClick={() => setMode('registration')}>
              <Icon name="plus" size={15} /> Registrace
            </button>
            <button className={'jb-seg-opt' + (mode === 'play' ? ' is-active is-play' : '')}
              onClick={() => setMode('play')}>
              <Icon name="play" size={13} /> Přehrávání
            </button>
          </div>
        </div>

        {/* Status console */}
        <div className="jb-card" style={{ padding: '14px 16px' }}>
          <SectionLabel right={<span className="jb-mono" style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.06em' }}>GATT · NOTIFY</span>}>
            Stav zařízení
          </SectionLabel>
          <ConsoleRow k="ZAŘÍZENÍ">
            <span style={{ color: connected ? 'var(--fg-0)' : 'var(--fg-3)' }}>{device.name}</span>
          </ConsoleRow>
          <ConsoleRow k="BLE">
            {connected
              ? <><span className="dot jb-live" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} /><span style={{ color: 'var(--accent-ink)' }}>připojeno</span></>
              : <><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--error)' }} /><span style={{ color: 'var(--error)' }}>odpojeno</span></>}
          </ConsoleRow>
          <ConsoleRow k="SIGNÁL">
            <span style={{ color: connected ? 'var(--fg-1)' : 'var(--fg-4)' }}>{connected ? device.rssi + ' dBm' : '—'}</span>
          </ConsoleRow>
          <ConsoleRow k="MÓD">
            <span style={{ color: mode === 'play' ? 'var(--accent-ink)' : 'var(--fg-0)' }}>{mode === 'play' ? 'přehrávání' : 'registrace'}</span>
          </ConsoleRow>
          <ConsoleRow k="POSLEDNÍ UID">
            <span style={{ color: lastUid ? 'var(--fg-0)' : 'var(--fg-4)' }}>{lastUid || '—'}</span>
          </ConsoleRow>
        </div>

        {!connected && (
          <button className="jb-card jb-row-tap" onClick={onOpenPairing} style={{
            padding: '16px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
            border: '1px solid var(--line-1)', cursor: 'pointer', width: '100%', background: 'var(--bg-1)',
          }}>
            <span style={{ color: 'var(--error)', display: 'flex' }}><Icon name="bluetooth-off" size={22} /></span>
            <span style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Čtečka není připojena</div>
              <div className="jb-mono" style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 3 }}>Spárujte se zařízením RFID-Jukebox</div>
            </span>
            <Icon name="chevron-right" size={18} style={{ color: 'var(--fg-3)' }} />
          </button>
        )}

        {/* Context: PLAY mode */}
        {mode === 'play' && (
          nowPlaying ? (
            <div>
              <SectionLabel>Právě hraje</SectionLabel>
              <div className="jb-card" style={{ padding: 16, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'var(--halo)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', position: 'relative' }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 12, flexShrink: 0,
                    background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-ink)',
                  }}>
                    {nowPlaying.playing ? <EqBars playing color="var(--accent)" size={24} /> : <Icon name="music" size={26} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sound ? sound.name : 'Neznámý zvuk'}
                    </div>
                    <div className="jb-mono" style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
                      <Icon name="card" size={13} />
                      {npCard ? npCard.name : 'náhled'} {nowPlaying.uid ? '· ' + nowPlaying.uid : ''}
                    </div>
                  </div>
                  <button className="jb-iconbtn" onClick={onStop} style={{
                    width: 44, height: 44, border: '1px solid var(--line-2)', color: 'var(--fg-0)',
                  }} aria-label="Zastavit">
                    <Icon name="stop" size={18} />
                  </button>
                </div>
                {/* progress */}
                <div style={{ marginTop: 16, position: 'relative' }}>
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-3)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 2, background: 'var(--accent)',
                      width: (sound ? Math.min(100, (nowPlaying.elapsed / sound.dur) * 100) : 0) + '%',
                      transition: 'width 250ms linear',
                    }} />
                  </div>
                  <div className="jb-mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-2)', marginTop: 7 }}>
                    <span>{fmtClock(nowPlaying.elapsed)}</span>
                    <span>{nowPlaying.playing ? 'dohraje · zvuk doběhne' : 'dohráno'}</span>
                    <span>{sound ? fmtClock(sound.dur) : '0:00'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <TapPrompt connected={connected} mode="play" />
          )
        )}

        {/* Context: REGISTRATION mode */}
        {mode === 'registration' && <TapPrompt connected={connected} mode="registration" />}

        {/* Reader simulator */}
        <div>
          <SectionLabel right={<span className="jb-mono" style={{ fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.06em' }}>DEMO</span>}>
            Simulátor čtečky
          </SectionLabel>
          <div className="jb-card" style={{ padding: 14 }}>
            <p style={{ fontSize: 12.5, color: 'var(--fg-2)', margin: '0 0 12px', lineHeight: 1.45 }}>
              {connected ? 'Přiložte testovací kartu ke čtečce — pošle UID přes BLE.' : 'Nejprve připojte čtečku v sekci párování.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {simCards.map(c => (
                <button key={c.uid} disabled={!connected} onClick={() => onSimTap(c.uid)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                  borderRadius: 9, border: '1px solid var(--line-1)', background: 'var(--bg-2)',
                  color: connected ? 'var(--fg-0)' : 'var(--fg-3)', cursor: connected ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font-mono)', fontSize: 11.5, opacity: connected ? 1 : 0.5,
                  WebkitTapHighlightColor: 'transparent', transition: 'border-color 150ms, background 150ms',
                }}>
                  <Icon name="contactless" size={15} style={{ color: c.unknown ? 'var(--fg-3)' : 'var(--accent-ink)' }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function TapPrompt({ connected, mode }) {
  const reg = mode === 'registration';
  return (
    <div style={{
      borderRadius: 14, border: '1px dashed var(--line-2)', padding: '30px 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      position: 'relative', overflow: 'hidden', background: 'var(--bg-1)',
      opacity: connected ? 1 : 0.55,
    }}>
      {connected && <div style={{ position: 'absolute', inset: 0, background: 'var(--halo)', pointerEvents: 'none' }} />}
      <div style={{ position: 'relative', width: 72, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        {connected && [0, 0.6].map((d, i) => (
          <span key={i} className="jb-ring" style={{
            position: 'absolute', width: 56, height: 56, borderRadius: '50%',
            border: '1.5px solid var(--accent)', animationDelay: d + 's',
          }} />
        ))}
        <span style={{
          width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-2)', border: '1px solid var(--line-1)', color: connected ? 'var(--accent-ink)' : 'var(--fg-3)',
        }}>
          <Icon name="contactless" size={28} />
        </span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 500 }}>
        {connected ? (reg ? 'Přiložte kartu k registraci' : 'Přiložte kartu k přehrání') : 'Připojte čtečku'}
      </div>
      <div className="jb-mono" style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 7, maxWidth: 250, lineHeight: 1.5 }}>
        {connected
          ? (reg ? 'Nová karta otevře přiřazení zvuku. Známá karta nabídne přemapování.' : 'Namapovaný zvuk se spustí okamžitě.')
          : 'Bez připojené čtečky nepřijdou žádné UID.'}
      </div>
    </div>
  );
}

/* ════════════════════ PAIRING ════════════════════════════ */
function PairingScreen(p) {
  const { connected, device, scanning, found, onScan, onConnect, onDisconnect, onClose, connectingId } = p;
  return (
    <div className="jb-body jb-screen-in">
      <div style={{ padding: '4px 20px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {connected ? (
          <div>
            <SectionLabel>Připojené zařízení</SectionLabel>
            <div className="jb-card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  width: 46, height: 46, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--accent-soft)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)', color: 'var(--accent-ink)',
                }}><Icon name="bluetooth-connected" size={24} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{device.name}</div>
                  <div className="jb-mono" style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 3 }}>{device.id}</div>
                </div>
                <span className="jb-badge jb-badge-ok"><span className="dot jb-live" style={{ background: 'var(--accent)' }} />{device.rssi} dBm</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="jb-btn jb-btn-danger" style={{ flex: 1 }} onClick={onDisconnect}>
                  <Icon name="unlink" size={17} /> Odpojit
                </button>
                <button className="jb-btn jb-btn-secondary" style={{ flex: 1 }} onClick={onClose}>Hotovo</button>
              </div>
            </div>
            <div className="jb-card" style={{ padding: 14, marginTop: 16 }}>
              <ConsoleRow k="SERVICE">6f0e0001…</ConsoleRow>
              <ConsoleRow k="CHAR">6f0e0002 · NOTIFY</ConsoleRow>
              <ConsoleRow k="AUTO-RECONNECT"><span style={{ color: 'var(--accent-ink)' }}>zapnuto</span></ConsoleRow>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', padding: '14px 0 4px' }}>
              <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {scanning && [0, 0.45, 0.9].map((d, i) => (
                  <span key={i} className="jb-ring" style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '1.5px solid var(--accent)', animationDelay: d + 's' }} />
                ))}
                <span style={{
                  width: 84, height: 84, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-1)', border: '1px solid var(--line-1)', color: scanning ? 'var(--accent-ink)' : 'var(--fg-2)',
                }}>
                  <Icon name={scanning ? 'search' : 'bluetooth'} size={34} />
                </span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 500 }}>{scanning ? 'Hledám zařízení…' : 'Připojte RFID čtečku'}</div>
              <div className="jb-mono" style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 7, lineHeight: 1.5 }}>
                {scanning ? 'Filtrováno podle service UUID' : 'BLE sken najde čtečku v dosahu'}
              </div>
            </div>

            {found.length > 0 && (
              <div>
                <SectionLabel right={scanning ? <span className="jb-mono jb-spin" style={{ color: 'var(--fg-3)', display: 'inline-flex' }}><Icon name="loader" size={13} /></span> : null}>
                  Nalezená zařízení · {found.length}
                </SectionLabel>
                <div className="jb-card" style={{ overflow: 'hidden' }}>
                  {found.map((d) => {
                    const isTarget = d.target;
                    const conn = connectingId === d.id;
                    return (
                      <div key={d.id} className="jb-row">
                        <span style={{ color: isTarget ? 'var(--accent-ink)' : 'var(--fg-3)', display: 'flex' }}>
                          <Icon name="bluetooth" size={20} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: isTarget ? 500 : 400, color: isTarget ? 'var(--fg-0)' : 'var(--fg-1)' }}>{d.name}</div>
                          <div className="jb-mono" style={{ fontSize: 10.5, color: 'var(--fg-3)', marginTop: 2 }}>{d.id} · {d.rssi} dBm</div>
                        </div>
                        {isTarget ? (
                          <button className="jb-btn jb-btn-primary" style={{ padding: '9px 14px', fontSize: 13 }} disabled={conn} onClick={() => onConnect(d)}>
                            {conn ? <span className="jb-spin" style={{ display: 'inline-flex' }}><Icon name="loader" size={15} /></span> : 'Připojit'}
                          </button>
                        ) : (
                          <span className="jb-badge">jiné</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button className="jb-btn jb-btn-primary jb-btn-block" onClick={onScan} disabled={scanning}>
              {scanning ? <><span className="jb-spin" style={{ display: 'inline-flex' }}><Icon name="loader" size={17} /></span> Skenuji…</> : <><Icon name="refresh" size={17} /> {found.length ? 'Skenovat znovu' : 'Spustit sken'}</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════ SOUND LIBRARY ══════════════════════ */
function LibraryScreen(p) {
  const { sounds, cards, onImport, importing, onPreview, previewId, onDeleteSound } = p;
  const usage = (id) => cards.filter(c => c.soundId === id).length;
  return (
    <div className="jb-body jb-screen-in">
      <div style={{ padding: '4px 20px 28px' }}>
        <button className="jb-btn jb-btn-primary jb-btn-block" onClick={onImport} disabled={importing} style={{ marginBottom: 20 }}>
          {importing ? <><span className="jb-spin" style={{ display: 'inline-flex' }}><Icon name="loader" size={17} /></span> Importuji…</> : <><Icon name="upload" size={17} /> Přidat zvuk</>}
        </button>

        {sounds.length === 0 ? (
          <EmptyState icon="audio-lines" title="Žádné zvuky" body="Importujte MP3, WAV nebo M4A z telefonu. Soubor se zkopíruje do aplikace." />
        ) : (
          <>
            <SectionLabel right={<span className="jb-mono" style={{ fontSize: 10, color: 'var(--fg-3)' }}>{sounds.length} souborů</span>}>Knihovna</SectionLabel>
            <div className="jb-card" style={{ overflow: 'hidden' }}>
              {sounds.map((s) => {
                const used = usage(s.id);
                const isPrev = previewId === s.id;
                return (
                  <div key={s.id} className="jb-row">
                    <button className="jb-iconbtn" onClick={() => onPreview(s.id)} style={{
                      width: 42, height: 42, flexShrink: 0, borderRadius: 10,
                      background: isPrev ? 'var(--accent-soft)' : 'var(--bg-2)',
                      border: '1px solid ' + (isPrev ? 'color-mix(in srgb, var(--accent) 30%, transparent)' : 'var(--line-1)'),
                      color: isPrev ? 'var(--accent-ink)' : 'var(--fg-1)',
                    }}>
                      {isPrev ? <EqBars playing size={18} /> : <Icon name="play" size={16} />}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                      <div className="jb-mono" style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 3, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span>{s.type}</span><span style={{ color: 'var(--fg-4)' }}>·</span><span>{fmtClock(s.dur)}</span>
                        <span style={{ color: 'var(--fg-4)' }}>·</span>
                        <span style={{ color: used ? 'var(--accent-ink)' : 'var(--fg-3)' }}>{used ? used + '× přiřazeno' : 'nepřiřazeno'}</span>
                      </div>
                    </div>
                    <button className="jb-iconbtn" onClick={() => onDeleteSound(s)} aria-label="Smazat"><Icon name="trash" size={18} /></button>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 14, lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
              Soubory jsou uloženy lokálně v telefonu. Žádný server.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════ CARDS ══════════════════════════════ */
function CardsScreen(p) {
  const { cards, soundById, onRename, onRemap, onDeleteCard, mode, setMode, setTab } = p;
  return (
    <div className="jb-body jb-screen-in">
      <div style={{ padding: '4px 20px 28px' }}>
        {cards.length === 0 ? (
          <EmptyState icon="card" title="Žádné karty" body="Přepněte na hlavní obrazovce do režimu registrace a přiložte kartu ke čtečce."
            action={<button className="jb-btn jb-btn-primary" onClick={() => { setMode('registration'); setTab('home'); }}><Icon name="plus" size={16} /> Registrovat kartu</button>} />
        ) : (
          <>
            <SectionLabel right={<span className="jb-mono" style={{ fontSize: 10, color: 'var(--fg-3)' }}>{cards.length} karet</span>}>Registrované karty</SectionLabel>
            <div className="jb-card" style={{ overflow: 'hidden' }}>
              {cards.map((c) => {
                const s = c.soundId ? soundById(c.soundId) : null;
                const missing = c.soundId && !s;
                return (
                  <div key={c.uid} className="jb-row" style={{ alignItems: 'flex-start' }}>
                    <span style={{
                      width: 42, height: 42, flexShrink: 0, borderRadius: 10, marginTop: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--bg-2)', border: '1px solid var(--line-1)', color: 'var(--fg-1)',
                    }}><Icon name="card" size={20} /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{c.name}</div>
                      <div className="jb-mono" style={{ fontSize: 11, color: 'var(--fg-2)', marginTop: 3 }}>{c.uid}</div>
                      <div style={{ marginTop: 9 }}>
                        {s ? (
                          <span className="jb-badge" style={{ color: 'var(--fg-1)' }}><Icon name="music" size={12} />{s.name}</span>
                        ) : missing ? (
                          <span className="jb-badge jb-badge-err"><Icon name="alert" size={12} />soubor chybí</span>
                        ) : (
                          <span className="jb-badge jb-badge-warn"><Icon name="alert" size={12} />bez zvuku</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button className="jb-btn jb-btn-secondary" style={{ padding: '8px 12px', fontSize: 13 }} onClick={() => onRename(c)}>
                          <Icon name="edit" size={15} /> Přejmenovat
                        </button>
                        <button className="jb-btn jb-btn-secondary" style={{ padding: '8px 12px', fontSize: 13 }} onClick={() => onRemap(c)}>
                          <Icon name="music" size={15} /> Zvuk
                        </button>
                      </div>
                    </div>
                    <button className="jb-iconbtn" onClick={() => onDeleteCard(c)} aria-label="Smazat"><Icon name="trash" size={18} /></button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{ padding: '52px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <span style={{
        width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-1)', border: '1px solid var(--line-1)', color: 'var(--fg-3)', marginBottom: 18,
      }}><Icon name={icon} size={28} /></span>
      <div style={{ fontSize: 17, fontWeight: 500 }}>{title}</div>
      <p style={{ fontSize: 13.5, color: 'var(--fg-2)', marginTop: 8, maxWidth: 280, lineHeight: 1.5 }}>{body}</p>
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

Object.assign(window, { HomeScreen, PairingScreen, LibraryScreen, CardsScreen, SectionLabel, ConsoleRow, EmptyState, TapPrompt, fmtClock });

/* JukeBLE — device frame chrome + shared primitives. Exported to window. */

const { useState, useEffect, useRef } = React;

/* ── Status bar (Android-style, themed via currentColor) ──── */
function StatusBar({ time = '9:41' }) {
  return (
    <div style={{
      height: 40, flexShrink: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 22px', position: 'relative',
      color: 'var(--fg-0)',
    }}>
      <span className="jb-mono" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>{time}</span>
      <div style={{
        position: 'absolute', left: '50%', top: 9, transform: 'translateX(-50%)',
        width: 11, height: 11, borderRadius: '50%', background: '#000',
        border: '2px solid rgba(0,0,0,0.25)',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, opacity: 0.92 }}>
        {/* cellular */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.6" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.6" />
          <rect x="9" y="3" width="3" height="9" rx="0.6" />
          <rect x="13.5" y="0.5" width="3" height="11.5" rx="0.6" />
        </svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M1.5 4.2a10 10 0 0 1 13 0" />
          <path d="M4 6.8a6.2 6.2 0 0 1 8 0" />
          <path d="M6.6 9.4a2.4 2.4 0 0 1 2.8 0" />
        </svg>
        {/* battery */}
        <svg width="25" height="13" viewBox="0 0 25 13" fill="none">
          <rect x="0.6" y="0.6" width="21" height="11.8" rx="3" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="2.4" y="2.4" width="14" height="8.2" rx="1.6" fill="currentColor" />
          <rect x="23" y="4" width="1.8" height="5" rx="0.9" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/* ── Device frame ─────────────────────────────────────────── */
function PhoneFrame({ theme = 'dark', children }) {
  return (
    <div style={{
      width: 392, height: 812, borderRadius: 46, padding: 11,
      background: 'linear-gradient(150deg, #34373b, #1b1d1f 60%, #2a2c2f)',
      boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 0 0 1.5px rgba(255,255,255,0.06)',
      flexShrink: 0,
    }}>
      <div className="jb-screen" data-theme={theme} style={{ borderRadius: 36 }}>
        <StatusBar />
        {children}
        <div style={{ height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 130, height: 5, borderRadius: 3, background: 'var(--fg-0)', opacity: 0.32 }} />
        </div>
      </div>
    </div>
  );
}

/* ── App header (title + connection status + theme toggle) ── */
function AppHeader({ title, sub, connected, onOpenPairing, theme, onToggleTheme, left }) {
  return (
    <div style={{ flexShrink: 0, padding: '8px 20px 14px', background: 'var(--bg-0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
        {left || (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Logo size={20} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className={'jb-badge ' + (connected ? 'jb-badge-ok' : 'jb-badge-err')}
            onClick={onOpenPairing}
            style={{ cursor: 'pointer', background: connected ? 'var(--accent-soft)' : 'var(--error-soft)' }}>
            <span className={'dot' + (connected ? ' jb-live' : '')} style={{ background: connected ? 'var(--accent)' : 'var(--error)' }} />
            {connected ? 'připojeno' : 'odpojeno'}
          </button>
          <button className="jb-iconbtn" onClick={onToggleTheme} aria-label="Přepnout motiv">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
          </button>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <h1 className="jb-h" style={{ fontSize: 30 }}>{title}</h1>
        {sub && <div className="jb-label" style={{ marginTop: 7 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ── Brand wordmark ───────────────────────────────────────── */
function Logo({ size = 20, mark = false }) {
  return (
    <span style={{
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: size,
      letterSpacing: '-0.03em', color: 'var(--fg-0)', display: 'inline-flex', alignItems: 'center',
    }}>
      Juke<span style={{ color: 'var(--accent-ink)' }}>BLE</span>
    </span>
  );
}

/* ── Bottom tab bar ───────────────────────────────────────── */
function BottomTabs({ active, onChange }) {
  const tabs = [
    { id: 'home', label: 'Domů', icon: 'activity' },
    { id: 'cards', label: 'Karty', icon: 'card' },
    { id: 'library', label: 'Zvuky', icon: 'audio-lines' },
  ];
  return (
    <div style={{
      flexShrink: 0, display: 'flex', padding: '8px 12px 10px',
      borderTop: '1px solid var(--line-1)',
      background: 'var(--nav-blur)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            padding: '7px 0', color: on ? 'var(--accent-ink)' : 'var(--fg-2)',
            WebkitTapHighlightColor: 'transparent', transition: 'color var(--dur-fast)',
          }}>
            <Icon name={t.icon} size={23} strokeWidth={on ? 2 : 1.5} />
            <span className="jb-mono" style={{
              fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase',
              fontWeight: on ? 600 : 500,
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Equalizer bars (now-playing) ─────────────────────────── */
function EqBars({ playing, color = 'var(--accent)', size = 18 }) {
  const delays = [0, 0.25, 0.5, 0.15, 0.4];
  const heights = [0.5, 0.85, 0.65, 1, 0.55];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: size }}>
      {delays.map((d, i) => (
        <div key={i} className={playing ? 'jb-eqbar' : ''} style={{
          width: 3, height: '100%', borderRadius: 2, background: color,
          transform: playing ? undefined : `scaleY(${heights[i] * 0.5})`,
          transformOrigin: 'bottom',
          animationDelay: `${d}s`,
        }} />
      ))}
    </div>
  );
}

/* ── Toast ────────────────────────────────────────────────── */
function Toast({ toast, onAction }) {
  if (!toast) return null;
  const tone = toast.tone || 'default';
  const iconName = tone === 'error' ? 'alert' : tone === 'ok' ? 'check-circle' : 'zap';
  const col = tone === 'error' ? 'var(--error)' : tone === 'ok' ? 'var(--accent-ink)' : 'var(--fg-0)';
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, bottom: 86, zIndex: 60,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
    }}>
      <div className="jb-toast jb-card" style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
        background: 'var(--bg-1)', maxWidth: '100%', pointerEvents: 'auto',
        boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
      }}>
        <span style={{ color: col, display: 'flex' }}><Icon name={iconName} size={19} /></span>
        <span style={{ fontSize: 14, color: 'var(--fg-0)', flex: 1, lineHeight: 1.35 }}>{toast.msg}</span>
        {toast.action && (
          <button className="jb-btn jb-btn-primary" style={{ padding: '7px 12px', fontSize: 13 }}
            onClick={() => onAction(toast.action)}>{toast.action.label}</button>
        )}
      </div>
    </div>
  );
}

/* ── Modal / bottom sheet ─────────────────────────────────── */
function Sheet({ open, onClose, children, title, label }) {
  if (!open) return null;
  return (
    <div className="jb-scrim" onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div className="jb-sheet" onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-1)', borderTop: '1px solid var(--line-2)',
        borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: '10px 20px 24px',
        maxHeight: '88%', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 14px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--line-2)' }} />
        </div>
        {(title || label) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
            <div>
              {label && <div className="jb-label" style={{ marginBottom: 6 }}>{label}</div>}
              {title && <h2 className="jb-h" style={{ fontSize: 22 }}>{title}</h2>}
            </div>
            <button className="jb-iconbtn" onClick={onClose}><Icon name="x" size={20} /></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { StatusBar, PhoneFrame, AppHeader, Logo, BottomTabs, EqBars, Toast, Sheet });

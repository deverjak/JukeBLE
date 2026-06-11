/* JukeBLE — icon set. Lucide-style, 1.5px stroke, currentColor.
   Single <Icon name size strokeWidth/> component. Exported to window. */

function Icon({ name, size = 22, strokeWidth = 1.5, style, className }) {
  const common = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style, className,
  };
  const filled = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'currentColor', stroke: 'none', style, className,
  };

  switch (name) {
    case 'bluetooth':
      return (<svg {...common}><path d="m7 7 10 10-5 5V2l5 5L7 17" /></svg>);
    case 'bluetooth-connected':
      return (<svg {...common}><path d="m7 7 10 10-5 5V2l5 5L7 17" /><line x1="18" y1="12" x2="21.5" y2="12" /><line x1="2.5" y1="12" x2="6" y2="12" /></svg>);
    case 'bluetooth-off':
      return (<svg {...common}><path d="m17 17-5 5V12l-5 5" /><path d="M14.5 9.5 17 7l-5-5v4.5" /><line x1="3" y1="3" x2="21" y2="21" /></svg>);
    case 'contactless': /* card-tap / scan */
      return (<svg {...common}><path d="M8.5 16.5a5 5 0 0 0 0-9" /><path d="M5.5 19.5a9 9 0 0 0 0-15" /><path d="M2.5 22.5a13 13 0 0 0 0-21" /></svg>);
    case 'card':
      return (<svg {...common}><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><line x1="2.5" y1="9.5" x2="21.5" y2="9.5" /><line x1="6" y1="14.5" x2="10" y2="14.5" /></svg>);
    case 'audio-lines':
      return (<svg {...common}><path d="M2 10v4" /><path d="M6 6v12" /><path d="M10 3v18" /><path d="M14 8v8" /><path d="M18 5v14" /><path d="M22 10v4" /></svg>);
    case 'music':
      return (<svg {...common}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>);
    case 'activity':
      return (<svg {...common}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>);
    case 'home':
      return (<svg {...common}><path d="m3 9.5 9-7 9 7V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20z" /><path d="M9 21.5v-7h6v7" /></svg>);
    case 'plus':
      return (<svg {...common}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
    case 'trash':
      return (<svg {...common}><path d="M3 6h18" /><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" /><path d="M18.5 6 17.8 19a1.5 1.5 0 0 1-1.5 1.4H7.7a1.5 1.5 0 0 1-1.5-1.4L5.5 6" /><line x1="10" y1="10.5" x2="10" y2="16.5" /><line x1="14" y1="10.5" x2="14" y2="16.5" /></svg>);
    case 'edit':
      return (<svg {...common}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>);
    case 'play':
      return (<svg {...filled}><path d="M7 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 7 5.5Z" /></svg>);
    case 'pause':
      return (<svg {...filled}><rect x="6.5" y="5" width="3.6" height="14" rx="1" /><rect x="13.9" y="5" width="3.6" height="14" rx="1" /></svg>);
    case 'stop':
      return (<svg {...filled}><rect x="6" y="6" width="12" height="12" rx="2" /></svg>);
    case 'sun':
      return (<svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
    case 'moon':
      return (<svg {...common}><path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>);
    case 'x':
      return (<svg {...common}><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>);
    case 'chevron-right':
      return (<svg {...common}><polyline points="9 6 15 12 9 18" /></svg>);
    case 'chevron-left':
      return (<svg {...common}><polyline points="15 6 9 12 15 18" /></svg>);
    case 'check':
      return (<svg {...common}><polyline points="20 6 9 17 4 12" /></svg>);
    case 'refresh':
      return (<svg {...common}><path d="M21 12a9 9 0 1 1-2.64-6.36" /><polyline points="21 3 21 8 16 8" /></svg>);
    case 'search':
      return (<svg {...common}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.5" y2="16.5" /></svg>);
    case 'upload':
      return (<svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 9 12 4 17 9" /><line x1="12" y1="4" x2="12" y2="16" /></svg>);
    case 'more':
      return (<svg {...common}><circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" /></svg>);
    case 'alert':
      return (<svg {...common}><path d="M10.3 3.8 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" /><line x1="12" y1="9" x2="12" y2="13.5" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>);
    case 'loader':
      return (<svg {...common}><path d="M12 3a9 9 0 1 0 9 9" /></svg>);
    case 'signal':
      return (<svg {...common}><line x1="4" y1="20" x2="4" y2="15" /><line x1="10" y1="20" x2="10" y2="11" /><line x1="16" y1="20" x2="16" y2="6" /><line x1="22" y1="20" x2="22" y2="3" opacity="0.35" /></svg>);
    case 'link':
      return (<svg {...common}><path d="M9 13a4 4 0 0 0 5.6.6l3-3a4 4 0 0 0-5.6-5.6l-1.5 1.5" /><path d="M15 11a4 4 0 0 0-5.6-.6l-3 3a4 4 0 0 0 5.6 5.6l1.5-1.5" /></svg>);
    case 'unlink':
      return (<svg {...common}><path d="m18.8 4 1.2 1.2a4 4 0 0 1 0 5.6L18 13" /><path d="M6 11 4.2 12.8a4 4 0 0 0 0 5.6L5.4 19.6a4 4 0 0 0 5.6 0L13 17.4" /><line x1="3" y1="3" x2="21" y2="21" /></svg>);
    case 'zap':
      return (<svg {...common}><path d="M13 2 4.5 13.5H11l-1 8.5L18.5 10H12l1-8Z" /></svg>);
    case 'check-circle':
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><polyline points="8.5 12 11 14.5 15.5 9.5" /></svg>);
    case 'clock':
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><polyline points="12 7.5 12 12 15 14" /></svg>);
    case 'file-audio':
      return (<svg {...common}><path d="M13 2H6.5A1.5 1.5 0 0 0 5 3.5v17A1.5 1.5 0 0 0 6.5 22h11a1.5 1.5 0 0 0 1.5-1.5V8Z" /><polyline points="13 2 13 8 19 8" /><path d="M9 17v-3l3-1v3" /><circle cx="8" cy="17" r="1.2" /><circle cx="11" cy="16" r="1.2" /></svg>);
    default:
      return (<svg {...common}><circle cx="12" cy="12" r="9" /></svg>);
  }
}

window.Icon = Icon;

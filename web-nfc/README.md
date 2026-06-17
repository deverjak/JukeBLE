# JukeNFC — landing page

A static, single-page marketing site for the **JukeNFC** Android app, built from the
JukeNFC design system. Tap a card, hear a sound — no extra hardware.

- **No framework, no build step.** Plain HTML + CSS + ~60 lines of vanilla JS.
- **Bilingual (EN / CS)** with the choice persisted in `localStorage`.
- **Self-contained** — only external dependency at runtime is Google Fonts.

## Structure

```
index.html              # the whole page (sections + inline SVG icon sprite)
vercel.json             # static hosting config (clean URLs, cache headers)
assets/                 # logo mark + lockups (SVG)
styles/
  app.css               # page/component styles
  tokens/               # design-system tokens (colors, typography, spacing)
js/
  strings.js            # EN/CS copy — the single source of truth for text
  app.js                # language toggle, dropdown, tap-to-preview highlight
```

## The Android app link

Every "Get the app / Get it on Android / Download" button points to:

```
https://play.google.com/store/apps/details?id=cz.chytredigital.jukenfc
```

To change it, search-and-replace that URL in `index.html` (it appears on the nav
button, the hero CTA, the bottom CTA, and the footer "Download" link).

## Editing copy

All visible text lives in `js/strings.js` under `en` / `cs`. Each translatable
element in `index.html` carries a `data-i18n="path.to.string"` attribute that
`js/app.js` fills on load and on language switch. The English text is also written
inline in `index.html` so the page still reads correctly with JavaScript disabled.

## Deploy to Vercel

This folder is the deploy root — no framework preset needed.

```bash
# from this directory
vercel --prod
```

Or in the Vercel dashboard: **New Project → import the repo → set the Root
Directory to `web-nfc` → Framework Preset: "Other" → Deploy.** There is no build
command and no install step; Vercel serves the files as-is.

## Local preview

Open `index.html` directly, or serve it (so relative paths resolve cleanly):

```bash
npx serve .        # or: python -m http.server
```

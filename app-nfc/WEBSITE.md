# JukeNFC — App Description for Website

A reference brief for building the marketing/landing website. Covers what the app
is, who it's for, the features to showcase, and the visual identity to match.

---

## One-liner

**Turn any NFC card into a sound. Tap a card, hear a sound — no extra hardware.**

JukeNFC is a mobile NFC jukebox. Your phone's built-in NFC antenna reads a card,
and the app plays the sound you mapped to it. No external reader, no Bluetooth
device, no pairing, no internet.

## Elevator pitch (2–3 sentences)

JukeNFC turns your phone into a tap-to-play sound box. Register any NFC tag or
card, assign it a sound from your library, and switch to play mode — from then on
just tapping a card plays its sound. Everything runs locally on the device, so
it works fully offline with zero setup beyond installing the app.

---

## Who it's for / use cases

- **Kids & learning** — tap an animal card → animal sound; flashcards that talk.
- **Accessibility & communication boards** — physical cards trigger spoken phrases.
- **Events, kiosks & exhibits** — leave a phone in kiosk mode; visitors tap cards.
- **Tabletop & games** — character or item cards that play themed audio cues.
- **Soundboards** — quick, physical triggers for effects, jingles, or cues.

## The core idea (how it works, plainly)

1. **Register** a card — switch to registration mode and tap any NFC card to the
   back of the phone. The app reads its unique ID (UID).
2. **Assign** a sound — pick an audio file from your library for that card.
3. **Play** — switch to play mode. Now every tap of that card instantly plays its
   sound. Tapping a different card stops the old one and starts the new one.

No accounts, no cloud, no companion hardware. Just the phone and the cards.

---

## Key features (website bullets)

- **Uses the phone's own NFC antenna** — no external reader, no ESP32, no Bluetooth
  pairing. Just tap and go.
- **Map cards to sounds** — one UID → one sound. Rename cards, remap sounds, delete
  anytime.
- **Your own sound library** — import MP3, WAV, or M4A from the phone. Files are
  copied into the app and stored locally.
- **Two clear modes** — *Registration* to add cards, *Play* to use them. A guard
  prevents accidentally leaving registration mode mid-setup.
- **Instant playback** — a new tap stops the current sound and starts the new one,
  with one sound at a time.
- **Background & lock-screen playback** — audio keeps playing when the app is
  backgrounded, with media controls and the sound name on the lock screen (Android).
- **Kiosk-friendly** — keeps the screen awake and resumes listening automatically,
  ideal for an always-on tap station.
- **Works fully offline** — no server, no internet. All data lives on the device
  (local database + files).
- **Live reader status** — see at a glance whether NFC is listening, ready,
  disabled, or unsupported, plus the last UID read.
- **Dark & light themes** — a refined dark-first interface that also adapts to light.
- **Cross-platform** — Android (continuous listening — just hold a card near) and
  iOS (system scan sheet per tap).

## Three pillars (for a features section)

| Pillar | Headline | Supporting copy |
|---|---|---|
| Simplicity | No hardware to buy | The phone *is* the reader. Nothing to pair, charge, or carry. |
| Privacy | Everything stays on the device | No accounts, no cloud, no tracking. Works on a plane. |
| Reliability | Built to run all day | Background audio, lock-screen controls, screen-awake kiosk mode. |

---

## Screens to feature (for screenshots / sections)

1. **Přehrávač (Player / Home)** — reader status console (NFC state, mode, last
   UID) and a "now playing" card.
2. **Karty (Cards)** — the mode switch (Registration / Play) and the list of
   registered cards, each showing its UID and assigned sound.
3. **Knihovna (Library)** — imported sounds with type, duration, and how many cards
   use each; tap to preview.

> Note: the app's UI language is **Czech**. The website can be Czech, English, or
> bilingual — labels above are translated for reference (Přehrávač = Player,
> Karty = Cards, Knihovna = Library).

---

## Visual identity (match the app)

The app uses the **Chytře.digital** design system — a dark-first, console-like,
monospace-accented aesthetic. Use these to keep the website consistent.

**Colors (dark theme — primary):**
- Background: `#000000` → surfaces `#0A0A0A`, `#141414`, `#1F1F1F`
- Text: `#FFFFFF` (primary) → `#CCCCCC`, `#999999`, `#666666` (muted)
- **Accent (green): `#00E676`** (pressed `#00CC6A`) — the signature brand color
- Warn: `#F5A524` · Error: `#FF5C5C`

**Colors (light theme):**
- Background `#FFFFFF`, text `#0A0A0A`, accent `#00C264`.

**Typography:**
- Sans: **Geist** (headings, body)
- Mono: **Geist Mono** (UIDs, status labels, technical details, data)

**Tone:** clean, technical, confident. Monospace for anything data-like (UIDs,
status, counts). Lots of black space, a single green accent, subtle hairline
borders. A "live dot" / pulse indicator conveys active listening.

---

## Suggested website structure

1. **Hero** — one-liner + tap animation/visual, "no extra hardware" badge, app
   store / download CTA.
2. **How it works** — the 3 steps (Register → Assign → Play).
3. **Features** — the three pillars + feature grid.
4. **Use cases** — kids, accessibility, events/kiosks, games.
5. **Screenshots** — Player, Cards, Library.
6. **Tech & privacy** — offline, on-device, no accounts.
7. **Download / FAQ** — platform notes (Android continuous read vs iOS tap scan;
   requires NFC-capable phone).

## Copy snippets (ready to use)

- *"The phone is the reader."*
- *"Tap a card. Hear a sound. That's it."*
- *"No pairing. No cloud. No internet. Just tap."*
- *"Bring your own sounds — import MP3, WAV, or M4A."*
- *"Built to run all day, even on the lock screen."*

## FAQ seeds

- **Do I need extra hardware?** No — it uses your phone's built-in NFC.
- **What cards work?** Any standard NFC tag/card; the app reads its unique UID.
- **Does it need internet?** No, everything works offline and stays on your device.
- **Which sound formats?** MP3, WAV, and M4A.
- **Android vs iOS?** Android listens continuously (just hold a card near the
  phone); iOS uses the system scan sheet for each tap.
- **Is my data private?** Yes — no accounts, no cloud, no tracking.

---

## Important accuracy notes for the site

- Requires an **NFC-capable phone**. Not all phones (especially older/budget iOS
  and some Android) support it.
- The app reads the card's **UID only** — it does not write to cards or read NDEF
  content. Sounds are mapped to UIDs, not stored on the cards.
- It's a **native app** (built with Expo / React Native); NFC needs a real
  development/production build, not a browser. The *website* is marketing only.

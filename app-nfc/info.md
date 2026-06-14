# JukeNFC

**Turn any NFC card into a sound. Tap a card, hear a sound — no extra hardware.**

JukeNFC is a mobile NFC jukebox. Your phone's built-in NFC antenna reads a card,
and the app plays the sound you mapped to it. No external reader, no Bluetooth
device, no pairing, no internet.

## What it does

JukeNFC turns your phone into a tap-to-play sound box. Register any NFC tag or
card, assign it a sound from your library, and switch to play mode — from then on
just tapping a card plays its sound. Everything runs locally on the device, so it
works fully offline with zero setup beyond installing the app.

## How it works

1. **Register** a card — switch to registration mode and tap any NFC card to the
   back of the phone. The app reads its unique ID (UID).
2. **Assign** a sound — pick an audio file from your library for that card.
3. **Play** — switch to play mode. Now every tap of that card instantly plays its
   sound. Tapping a different card stops the old one and starts the new one.

No accounts, no cloud, no companion hardware. Just the phone and the cards.

## Who it's for

- **Kids & learning** — tap an animal card → animal sound; flashcards that talk.
- **Accessibility & communication boards** — physical cards trigger spoken phrases.
- **Events, kiosks & exhibits** — leave a phone in kiosk mode; visitors tap cards.
- **Tabletop & games** — character or item cards that play themed audio cues.
- **Soundboards** — quick, physical triggers for effects, jingles, or cues.

## Key features

- **Uses the phone's own NFC antenna** — no external reader, no ESP32, no Bluetooth
  pairing. Just tap and go.
- **Map cards to sounds** — one card → one sound. Rename cards, remap sounds, delete
  anytime.
- **Your own sound library** — import MP3, WAV, or M4A from the phone. Files are
  copied into the app and stored locally.
- **Two clear modes** — *Registration* to add cards, *Play* to use them. A guard
  prevents accidentally leaving registration mode mid-setup.
- **Instant playback** — a new tap stops the current sound and starts the new one,
  one sound at a time.
- **Background & lock-screen playback** — audio keeps playing when the app is
  backgrounded, with media controls and the sound name on the lock screen (Android).
- **Kiosk-friendly** — keeps the screen awake and resumes listening automatically,
  ideal for an always-on tap station.
- **Works fully offline** — no server, no internet. All data lives on the device
  (local database + files).
- **Live reader status** — see at a glance whether NFC is listening, ready,
  disabled, or unsupported, plus the last UID read.
- **Dark & light themes** — a refined dark-first interface that also adapts to light.

## Platform differences (Android vs iOS)

NFC behaves differently on each platform — this is an Apple restriction, not an app
choice.

- **Android — continuous, hands-off.** The app listens in the background while open.
  You just hold a card near the phone and it reads instantly, one card after
  another, with no prompts. This is what makes Android ideal for an always-on kiosk.
- **iOS — one tap at a time.** Apple does not allow apps to silently listen for NFC.
  Each read requires starting a scan, which makes iOS show its own system pop-up
  ("Hold your iPhone near the NFC tag"). It reads one card, then the pop-up closes.
  Reading another card means triggering the scan again. The seamless "leave it
  running and just tap" experience only works fully on Android.

## Good to know

- Requires an **NFC-capable phone**. Not all phones (especially older/budget
  devices) support NFC.
- The app reads the card's **UID only** — it does not write to cards or read their
  stored content. Sounds are mapped to the UID, not saved on the card.
- **Private by design** — no accounts, no cloud, no tracking. All data stays on the
  device.
- Supported audio formats: **MP3, WAV, M4A**.
- The app interface is currently in **Czech** (Přehrávač = Player, Karty = Cards,
  Knihovna = Library).

## Visual identity

JukeNFC uses the **Chytře.digital** design system — a dark-first, console-like look
with a monospace accent.

- **Background:** black (`#000000`) with layered dark surfaces.
- **Accent:** signature green `#00E676`.
- **Typography:** Geist (headings & body), Geist Mono (UIDs, status, data).
- **Tone:** clean, technical, confident — lots of black space, a single green
  accent, subtle hairline borders, and a pulsing "live" dot when listening.

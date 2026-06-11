# JukeBLE — RFID Jukebox

A DIY RFID jukebox: an ESP32 with an MFRC522 reader scans card UIDs and streams them
over BLE to a mobile app (Expo / React Native). The app maps cards to sound files
stored on the phone and plays them. No backend — everything lives locally on the device.

```
┌──────────────┐         ┌─────────────────────┐        BLE notify        ┌──────────────────────────┐
│  RFID card   │ ──────▶ │  ESP32 + MFRC522    │ ───────────────────────▶ │  Expo app (phone)        │
│  Mifare 4B   │  tap    │  BLE GATT server    │   raw UID (4–10 bytes)   │  registration/play mode  │
└──────────────┘         └─────────────────────┘                          │  local DB + audio player │
                                                                          └──────────────────────────┘
```

The ESP32 is intentionally "dumb" — it only streams UIDs. All logic (registration vs.
play mode, card→sound mapping, playback) lives in the app.

## Repository layout

| Path | What it is |
|---|---|
| `app/` | Expo SDK 56 mobile app (TypeScript, expo-router). UI is in Czech. See `app/README.md`. |
| `esp32-firmware/jukeble-firmware/` | Arduino IDE sketch: MFRC522 polling + BLE GATT server |
| `esp32-firmware/sketch/` | Original reader-only test sketch (no BLE) |
| `docs/rfid-jukebox-architektura.md` | Architecture document (Czech) — source of truth for design decisions |
| `design-prototype/` | HTML/JSX design prototype the app UI was ported from |

## BLE profile

The contract between firmware and app. Values are defined in
`app/src/constants/ble.ts` and `esp32-firmware/jukeble-firmware/jukeble-firmware.ino`
and **must stay in sync**.

| | Value |
|---|---|
| Device name | `RFID-Jukebox` |
| Service UUID | `6f0e0001-aa1b-4c6e-8a3d-1f2e3c4d5e6f` (also in the advertising packet) |
| Characteristic | `6f0e0002-aa1b-4c6e-8a3d-1f2e3c4d5e6f` — NOTIFY + CCCD |
| Payload | Raw UID bytes (4–10 B), no encoding; the app renders the hex string |

Only one phone connects at a time (advertising stops while connected). The firmware
debounces repeated reads: a different UID is sent immediately, the same UID only after
a 2 s cooldown.

## Hardware

ESP32 DevKit (classic ESP32 — not S2, which lacks BLE) + MFRC522 module (13.56 MHz).

| MFRC522 | ESP32 | Note |
|---|---|---|
| SDA (SS) | GPIO 5 | chip select |
| SCK | GPIO 18 | VSPI clock |
| MOSI | GPIO 23 | |
| MISO | GPIO 19 | |
| RST | GPIO 22 | |
| 3.3V | 3V3 | **never 5 V** |
| GND | GND | |
| IRQ | — | unused, polling |

## Firmware (Arduino IDE)

1. Board: **ESP32 Dev Module** (Espressif `esp32` board package).
2. Libraries: **MFRC522** (miguelbalboa) from Library Manager. BLE is bundled with the
   ESP32 core — nothing extra to install.
3. If linking fails with *"Sketch too big"*: Tools → Partition Scheme →
   **Huge APP (3MB No OTA/1MB SPIFFS)**.
4. Flash `esp32-firmware/jukeble-firmware/jukeble-firmware.ino`, open Serial Monitor
   at 115200 to watch card reads and BLE state.

## Mobile app

BLE requires native code, so **Expo Go does not work** — use a development build:

```bash
cd app
npm install
npx expo run:android                                   # local build (needs Android SDK)
# or cloud builds:
npx eas-cli build --profile development --platform android   # dev client
npx eas-cli build --profile preview --platform android       # installable APK
```

OTA updates (JS/asset changes only) ship via EAS Update:

```bash
npx eas-cli update --channel preview --message "what changed"
```

In development builds the home screen includes a **card simulator** (`__DEV__` only),
so the full registration/play flow can be tested without the ESP32.

## How it works

- **Pairing** (one-time): the app scans filtered by the service UUID, the user picks the
  reader, the device id is persisted and the app auto-reconnects on launch (backoff
  1 s → 2 s → 5 s after unexpected drops).
- **Registration mode**: tap a card → the app opens an assign sheet (name + sound from
  the library, with quick import). Known cards offer remapping.
- **Play mode**: tap a card → the mapped sound plays immediately; a new card stops the
  current sound. Unknown cards and unmapped cards surface actionable toasts.
- **Storage**: SQLite (`sounds`, `cards` tables); audio files are copied into the app's
  document directory with relative paths.

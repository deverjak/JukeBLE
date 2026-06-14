# JukeNFC app

Expo SDK 56 (RN 0.85, React 19.2, new arch, react-compiler enabled) — NFC jukebox
client. This is the NFC sibling of the BLE app in `../app/`: instead of pairing with
an external ESP32 RFID reader over Bluetooth, the **phone's own NFC antenna reads the
card UID directly**. There is no firmware and no pairing. UI follows
`../design-prototype/` (tokens ported to `src/theme/tokens.ts`).

- Routes live in `src/app/` (expo-router). Domain logic lives in `src/services/` and
  `src/state/JukeboxContext.tsx` (the mode router) — keep screens thin. The mode router
  is reader-agnostic; only `src/services/nfc.ts` differs from the BLE variant.
- `src/services/nfc.ts` wraps `react-native-nfc-manager`: continuous tag discovery on
  Android (`registerTagEvent`), per-session scans on iOS. `src/utils/uid.ts` normalises
  the tag id to the `AA:BB:CC:DD` hex form the rest of the app uses.
- NFC needs a development build (`npx expo run:android` or EAS `development` profile);
  Expo Go will not work. There is a `__DEV__`-only reader simulator on the home screen.
- UI text is Czech. Fonts: Geist / Geist Mono via @expo-google-fonts.
- Native folders (`android/`, `ios/`) are generated (CNG) and gitignored — change
  native config only via `app.json` plugins, then verify with
  `npx expo prebuild --platform android --no-install`.
- The EAS project is not linked yet — run `eas init` to create/link a new project
  before building (the BLE project's `projectId`/`owner`/`updates` were intentionally
  removed from `app.json`).
- Validate with: `npx tsc --noEmit` and `npx expo lint`.

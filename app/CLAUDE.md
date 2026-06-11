# JukeBLE app

Expo SDK 56 (RN 0.85, React 19.2, new arch, react-compiler enabled) — RFID jukebox
client. Read `../docs/rfid-jukebox-architektura.md` before touching BLE/firmware-facing
code; UI follows `../design-prototype/` (tokens ported to `src/theme/tokens.ts`).

- Routes live in `src/app/` (expo-router). Domain logic lives in `src/services/` and
  `src/state/JukeboxContext.tsx` (the mode router) — keep screens thin.
- `src/constants/ble.ts` holds the GATT UUIDs; the ESP32 firmware must match them.
  Never change them casually.
- BLE needs a development build (`npx expo run:android` or EAS `development` profile);
  Expo Go will not work. There is a `__DEV__`-only reader simulator on the home screen.
- UI text is Czech. Fonts: Geist / Geist Mono via @expo-google-fonts.
- Native folders (`android/`, `ios/`) are generated (CNG) and gitignored — change
  native config only via `app.json` plugins, then verify with
  `npx expo prebuild --platform android --no-install`.
- Validate with: `npx tsc --noEmit` and `npx expo lint`.

# JukeBLE — RFID Jukebox (mobilní aplikace)

Expo (SDK 56) aplikace pro RFID jukebox: ESP32 + MFRC522 čte UID karet a posílá je
přes BLE notify do telefonu. Aplikace mapuje karty na lokální zvukové soubory a v play
módu je přehrává. Architektura: `../docs/rfid-jukebox-architektura.md`, design:
`../design-prototype/`.

## Důležité: Expo Go nestačí

`react-native-ble-plx` obsahuje nativní kód → je nutný **development build**:

```bash
npm install

# lokální build (vyžaduje Android SDK)
npx expo run:android

# nebo cloud build přes EAS
npx eas build --profile development --platform android
```

Po instalaci dev buildu se appka spouští přes `npx expo start`.
Preview build (instalovatelná APK bez dev serveru): `npx eas build --profile preview --platform android`.

## Struktura

```
src/
├── app/                  # expo-router routes
│   ├── _layout.tsx       # fonty, providery, Stack, globální toast + sheety
│   ├── (tabs)/           # Domů (přehrávač) · Karty · Zvuky
│   └── pairing.tsx       # BLE párování (sken, connect, odpojení)
├── components/           # UI dle design-prototype (dark-first tokeny)
├── constants/ble.ts      # SERVICE/CHAR UUID — MUSÍ sedět s firmwarem ESP32!
├── services/
│   ├── ble.ts            # BleManager singleton: sken (filtr service UUID),
│   │                     # monitor NOTIFY, auto-reconnect (1s→2s→5s)
│   ├── database.ts       # expo-sqlite: sounds + cards (UID → sound_id)
│   ├── audio.ts          # expo-audio: jeden zvuk naráz, nový UID = stop + play
│   ├── library.ts        # import přes document picker → kopie do documentDir/sounds/
│   └── settings.ts       # kv-store: spárované zařízení, motiv
├── state/JukeboxContext.tsx  # mode router: registration | play, dispatch UID
└── theme/                # tokeny z design-prototype/styles.css, dark/light
```

## BLE profil (firmware musí odpovídat)

| | |
|---|---|
| Device name | `RFID-Jukebox` |
| Service UUID | `6f0e0001-aa1b-4c6e-8a3d-1f2e3c4d5e6f` |
| Characteristic | `6f0e0002-aa1b-4c6e-8a3d-1f2e3c4d5e6f` (NOTIFY + CCCD) |
| Payload | raw bajty UID (4–10 B), bez kódování |

## Poznámky

- Přepínač módu (registrace / přehrávání) je na záložce **Karty**; opuštění záložky
  v módu registrace vyžaduje potvrzení a přepne mód zpět na přehrávání.
- V dev buildu je na obrazovkách Domů a Karty **simulátor čtečky** (`__DEV__` only) —
  celý registrační i přehrávací flow lze testovat bez ESP32.
- Android 12+: runtime permissions `BLUETOOTH_SCAN` (s `neverForLocation`) a
  `BLUETOOTH_CONNECT`; Android ≤ 11: `ACCESS_FINE_LOCATION`. Řeší `services/ble.ts`.
- Zvuky se ukládají s relativní cestou (iOS mění absolutní URI při updatu).
- Žádný backend — vše lokálně (SQLite + filesystem).

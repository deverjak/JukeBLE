# JukeNFC — NFC Jukebox (mobilní aplikace)

Expo (SDK 56) aplikace pro NFC jukebox: telefon **čte UID karet přímo svou NFC anténou**
— žádná externí čtečka, žádný ESP32, žádné párování. Aplikace mapuje karty na lokální
zvukové soubory a v play módu je přehrává. Jde o NFC variantu sourozenecké BLE aplikace
v `../app/`. Design: `../design-prototype/`.

## Důležité: Expo Go nestačí

`react-native-nfc-manager` obsahuje nativní kód → je nutný **development build**:

```bash
npm install

# propojení s novým EAS projektem (jen jednou)
npx eas init

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
│   └── nfc.tsx           # NFC obrazovka (stav, spustit/zastavit čtení, nastavení)
├── components/           # UI dle design-prototype (dark-first tokeny)
├── constants/nfc.ts      # ladění NFC (hint pro iOS sken, debounce taps)
├── services/
│   ├── nfc.ts            # NfcManager singleton: průběžné čtení tagů (Android),
│   │                     # session sken (iOS), normalizace UID, stav antény
│   ├── database.ts       # expo-sqlite: sounds + cards (UID → sound_id)
│   ├── audio.ts          # expo-audio: jeden zvuk naráz, nový UID = stop + play
│   ├── library.ts        # import přes document picker → kopie do documentDir/sounds/
│   └── settings.ts       # kv-store: motiv
├── state/JukeboxContext.tsx  # mode router: registration | play, dispatch UID
└── theme/                # tokeny z design-prototype/styles.css, dark/light
```

## NFC čtení

| | |
|---|---|
| Zdroj | vestavěná NFC anténa telefonu |
| Android | průběžné čtení (`registerTagEvent`) — appka naslouchá, stačí přiložit kartu |
| iOS | systémový sken sheet na jedno přiložení (per-session) |
| UID | `tag.id` → normalizováno na `AA:BB:CC:DD` (4–10 B) |

## Poznámky

- Mode router (`JukeboxContext`) je nezávislý na čtečce — proti BLE variantě se liší jen
  `services/nfc.ts` (a obrazovka `nfc.tsx` místo `pairing.tsx`).
- Přepínač módu (registrace / přehrávání) je na záložce **Karty**; opuštění záložky
  v módu registrace vyžaduje potvrzení a přepne mód zpět na přehrávání.
- V dev buildu je na obrazovkách Domů a Karty **simulátor čtečky** (`__DEV__` only) —
  celý registrační i přehrávací flow lze testovat bez fyzické NFC karty.
- Android: oprávnění `NFC`; appka při startu automaticky spustí naslouchání, je-li NFC
  zapnuté. Když je vypnuté, obrazovka NFC nabídne otevření systémového nastavení.
- EAS projekt zatím není propojený — `app.json` nemá `projectId`/`owner`/`updates`.
  Před buildem spusťte `eas init`.
- Zvuky se ukládají s relativní cestou (iOS mění absolutní URI při updatu).
- Žádný backend — vše lokálně (SQLite + filesystem).

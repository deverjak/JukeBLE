# RFID Jukebox — architektura systému

ESP32 s RFID čtečkou čte UID karet a posílá je přes BLE do mobilní aplikace (Expo / React Native). Aplikace mapuje karty na zvukové soubory uložené v telefonu a v play módu je přehrává.

## 1. Přehled systému

```
┌──────────────┐         ┌─────────────────────┐        BLE notify        ┌──────────────────────────┐
│  RFID karta  │ ──────▶ │  ESP32 + MFRC522    │ ───────────────────────▶ │  Expo aplikace (mobil)   │
│  Mifare 4B   │ přilož. │  BLE GATT server    │   raw UID (4–10 bajtů)   │  registrace / play mód   │
└──────────────┘         └─────────────────────┘                          │  lokální DB + přehrávač  │
                                                                          └──────────────────────────┘
```

Klíčová rozhodnutí (zafixovaná):

| Rozhodnutí | Hodnota | Důsledek |
|---|---|---|
| RFID čtečka | MFRC522 přes SPI | Polling, žádná HW událost "karta odebrána" |
| Odebrání karty | Zvuk dohraje | Firmware neřeší detekci odebrání, jen debounce |
| Počet mobilů | Vždy jen jeden | ESP32 po připojení zastaví advertising |
| Logika módů | Pouze v aplikaci | ESP32 je "hloupé" — vždy jen streamuje UID |
| Backend | Žádný | Vše lokálně v telefonu, žádný server |

## 2. Hardware

- ESP32 DevKit (libovolný s BLE, tj. prakticky všechny klasické ESP32; ESP32-S2 BLE nemá — nepoužívat)
- MFRC522 modul (13,56 MHz, Mifare Classic / NTAG)
- Mifare karty/tagy — z testu: 4bajtové UID, např. `C0:7C:3C:52`

### Zapojení MFRC522 → ESP32 (VSPI, výchozí piny)

| MFRC522 | ESP32 | Poznámka |
|---|---|---|
| SDA (SS) | GPIO 5 | Chip select |
| SCK | GPIO 18 | SPI clock |
| MOSI | GPIO 23 | |
| MISO | GPIO 19 | |
| RST | GPIO 27 | Libovolný volný GPIO |
| 3.3V | 3V3 | **Nikdy 5 V** — MFRC522 je 3,3V |
| GND | GND | |
| IRQ | nezapojeno | Nepoužíváme, čteme pollingem |

## 3. Firmware (ESP32)

Doporučený stack: PlatformIO + Arduino framework. Knihovny:

- `miguelbalboa/MFRC522` — čtení karet
- `BLEDevice` (součást ESP32 Arduino core, Bluedroid) — GATT server. Alternativně `NimBLE-Arduino` (menší flash/RAM footprint, doporučeno, API téměř shodné).

### 3.1 BLE GATT profil

Jedna service, jedna characteristic. Vygeneruj si vlastní 128bit UUID (např. `uuidgen`):

```
Device name:     "RFID-Jukebox"
Service UUID:    6f0e0001-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Characteristic:  6f0e0002-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Properties:    NOTIFY
  Payload:       raw bajty UID (4–10 B), bez formátování
  Descriptor:    CCCD (0x2902) — nutný, jinak notifikace nefungují
```

Žádné JSON, žádné textové kódování — hex string si vyrobí aplikace. Service UUID dej i do advertising packetu, aby appka mohla skenovat cíleně.

### 3.2 Chování firmware

1. **Boot:** init SPI + MFRC522, start BLE, start advertising.
2. **Connect callback:** zastavit advertising (garance jediného klienta).
3. **Disconnect callback:** obnovit advertising.
4. **Loop:** polling čtečky + debounce + notify.

### 3.3 Debounce (řeší opakované detekce z tvého logu)

MFRC522 hlásí kartu opakovaně, dokud leží na čtečce. Pravidlo:

- **jiné UID než minulé** → poslat hned,
- **stejné UID** → poslat znovu až po cooldownu (2 s).

```cpp
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN  5
#define RST_PIN 27

MFRC522 rfid(SS_PIN, RST_PIN);

String lastUid = "";
unsigned long lastSent = 0;
const unsigned long COOLDOWN_MS = 2000;

String uidToHex(byte *buf, byte len) {
  String s;
  for (byte i = 0; i < len; i++) {
    if (buf[i] < 0x10) s += "0";
    s += String(buf[i], HEX);
  }
  s.toUpperCase();
  return s;
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  String uid = uidToHex(rfid.uid.uidByte, rfid.uid.size);
  bool shouldSend = (uid != lastUid) || (millis() - lastSent > COOLDOWN_MS);

  if (shouldSend && deviceConnected) {
    uidCharacteristic->setValue(rfid.uid.uidByte, rfid.uid.size); // raw bajty
    uidCharacteristic->notify();
    lastUid = uid;
    lastSent = millis();
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
```

Pozn.: posílá se **jen při připojeném klientovi** (`deviceConnected` nastavují BLE callbacky). Volitelně blikni LED při odeslání — pomáhá při ladění.

## 4. Mobilní aplikace (Expo / React Native)

### 4.1 Zásadní omezení: Expo Go nestačí

`react-native-ble-plx` obsahuje nativní kód → **musíš použít development build**:

```bash
npx create-expo-app rfid-jukebox
cd rfid-jukebox
npx expo install react-native-ble-plx expo-dev-client expo-document-picker expo-file-system expo-audio expo-sqlite
npx expo run:android   # lokální build, vyžaduje Android SDK
# nebo: eas build --profile development --platform android
```

### 4.2 Konfigurace (app.json)

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-ble-plx",
        {
          "isBackgroundEnabled": false,
          "modes": ["central"],
          "bluetoothAlwaysPermission": "Aplikace používá Bluetooth pro spojení s RFID čtečkou."
        }
      ]
    ],
    "android": {
      "permissions": [
        "android.permission.BLUETOOTH_SCAN",
        "android.permission.BLUETOOTH_CONNECT"
      ]
    }
  }
}
```

Na Androidu 12+ si runtime permissions (`BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`) vyžádej přes `PermissionsAndroid` před prvním skenem. Na starších Androidech (≤ 11) je pro BLE sken nutné `ACCESS_FINE_LOCATION`.

### 4.3 Vrstvy aplikace

```
┌─────────────────────────────────────────────┐
│ UI (screens)                                │
│  • Párování (sken + výběr zařízení)         │
│  • Knihovna zvuků (import, seznam, mazání)  │
│  • Karty (seznam registrovaných, přejmen.)  │
│  • Hlavní obrazovka (přepínač Reg/Play,     │
│    stav připojení, "now playing")           │
├─────────────────────────────────────────────┤
│ Mode router (globální stav)                 │
│  appMode: 'registration' | 'play'           │
│  onUid(uid) → dispatch podle módu           │
├──────────────┬──────────────┬───────────────┤
│ BLE service  │ Storage      │ Audio service │
│ ble-plx      │ SQLite + FS  │ expo-audio    │
└──────────────┴──────────────┴───────────────┘
```

#### BLE service (`services/ble.ts`)

- Singleton `BleManager`.
- **Sken:** `startDeviceScan([SERVICE_UUID], ...)` — filtruj podle service UUID, ne podle jména.
- **Párování:** uživatel vybere zařízení → ulož `device.id` (na Androidu MAC, na iOS UUID) do storage.
- **Auto-reconnect:** při startu appky zkus `connectToDevice(savedId)`; když selže nebo ID není, nabídni sken. Při `onDisconnected` naplánuj retry (exponenciální backoff, např. 1 s → 2 s → 5 s, pak čekej na manuální akci).
- **Subscribe:** po connectu `discoverAllServicesAndCharacteristics()` → `monitorCharacteristicForService(SERVICE_UUID, CHAR_UUID, cb)`.
- **Dekódování:** hodnota chodí jako base64 → dekóduj na bajty → hex string:

```ts
import { Buffer } from "buffer";

function decodeUid(base64Value: string): string {
  const bytes = Buffer.from(base64Value, "base64");
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(":"); // "C0:7C:3C:52"
}
```

#### Storage (`services/storage.ts`)

Doporučení: `expo-sqlite` (čistší než AsyncStorage pro seznamy a editaci).

```sql
CREATE TABLE IF NOT EXISTS sounds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,           -- zobrazovaný název
  file_path TEXT NOT NULL,      -- relativní cesta v documentDirectory
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cards (
  uid TEXT PRIMARY KEY,         -- "C0:7C:3C:52"
  name TEXT,                    -- volitelný alias karty
  sound_id INTEGER REFERENCES sounds(id) ON DELETE SET NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

Ukládej **relativní cesty** (jen název souboru) — absolutní `documentDirectory` URI se na iOS po update appky mění.

#### Import zvuků (`services/library.ts`)

1. `DocumentPicker.getDocumentAsync({ type: "audio/*" })` — pokryje MP3, M4A, WAV…
2. URI z pickeru je **dočasné** → ihned zkopíruj:

```ts
import * as FileSystem from "expo-file-system";

const SOUNDS_DIR = FileSystem.documentDirectory + "sounds/";

async function importSound(pickedUri: string, originalName: string) {
  await FileSystem.makeDirectoryAsync(SOUNDS_DIR, { intermediates: true });
  const fileName = `${Date.now()}_${originalName}`;
  await FileSystem.copyAsync({ from: pickedUri, to: SOUNDS_DIR + fileName });
  return fileName; // tohle jde do DB jako file_path
}
```

3. Insert do tabulky `sounds`.

#### Audio service (`services/audio.ts`)

`expo-audio` (nástupce `expo-av`). Chování:

- Nový UID během přehrávání → **stopni staré, spusť nové** (jukebox chování).
- Stejný UID během přehrávání → ignoruj (debounce na ESP32 to většinou odfiltruje, ale appka ať je odolná — drž `currentUid` a porovnej).
- Nastav audio mode tak, ať hraje i v silent módu iOS (`playsInSilentMode: true`), pokud je to žádoucí.

### 4.4 Datové toky

**Párování (jednorázově):**

```
Otevřít párování → sken (filtr SERVICE_UUID) → výběr zařízení →
connect → uložit device.id → subscribe na UID characteristic
```

**Registrace karty:**

```
Přepnout mód = registrace → přiložit kartu → notify UID →
appka: UID není v DB? → modal "Nová karta C0:7C:3C:52" →
výběr zvuku z knihovny (nebo import nového) → INSERT do cards
UID už v DB? → nabídnout přemapování / přejmenování
```

**Play:**

```
Mód = play → přiložit kartu → notify UID → SELECT z cards →
  nalezeno → stop current → play zvuk
  nenalezeno → toast "Neznámá karta" + tlačítko "Registrovat"
```

**Odebrání karty:** nic — zvuk dohraje, firmware odebrání nedetekuje.

## 5. Edge cases a chování

| Situace | Chování |
|---|---|
| Mobil odpojen, přiložena karta | ESP32 nic neposílá (notify jen při připojení); volitelně červená LED |
| Druhý mobil se chce připojit | Nejde — advertising je po connectu vypnutý |
| Zvukový soubor smazán z DB/disku | Play mód: toast "Soubor chybí", nabídnout přemapování |
| Stejná karta 2× rychle | Cooldown 2 s na ESP32 + `currentUid` check v appce |
| Appka v pozadí | MVP: nepodporováno (BLE background = další komplexita); řešit později |
| UID delší než 4 B (7B NTAG) | Funguje automaticky — posílají se raw bajty, hex string je jen delší |

## 6. Postup vývoje (doporučené pořadí)

1. **Firmware: BLE skeleton** — advertising, connect/disconnect callbacky, testovací notify každých 5 s (např. fixní bajty). Ověř přes nRF Connect (mobilní appka), že notifikace chodí.
2. **Firmware: napojit MFRC522** — UID místo testovacích dat, debounce. Ověř opět v nRF Connect.
3. **Appka: BLE vrstva** — dev build, sken, connect, subscribe, výpis UID na obrazovku. Tady máš end-to-end pipeline hotovou.
4. **Appka: knihovna zvuků** — picker, kopie do FS, SQLite, přehrání po ťuknutí v seznamu.
5. **Appka: módy + mapování** — registrace, play, modal pro novou kartu.
6. **Polish** — auto-reconnect, stavové indikace, edge cases z tabulky výše.

Krok 1–2 a 3–4 jdou dělat paralelně — nRF Connect ti nahradí appku, fake notify ti nahradí ESP32.

## 7. Co vědomě NENÍ v MVP

- Write characteristic (příkazy mobil → ESP32: pípnutí, LED potvrzení)
- BLE bonding/šifrování (pro domácí použití zbytečné; kdokoliv se sice může připojit, ale jen čte UID)
- Background mode / přehrávání se zamčeným displejem
- Více čteček / více mobilů
- Zápis dat na karty (používá se jen UID, karty zůstávají prázdné)

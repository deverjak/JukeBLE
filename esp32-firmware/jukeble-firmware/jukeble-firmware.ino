/*
 * JukeBLE — ESP32 RFID jukebox firmware
 * =====================================
 * MFRC522 reads card UIDs, ESP32 streams them as raw bytes over a BLE
 * NOTIFY characteristic to the JukeBLE mobile app (Expo).
 *
 * The ESP32 is intentionally "dumb": it only streams UIDs. All mode
 * logic (registration vs. play) lives in the app.
 * See: docs/rfid-jukebox-architektura.md
 *
 * Board:    ESP32 Dev Module (generic devkit)
 * Libraries:
 *   - MFRC522 (miguelbalboa) — Library Manager
 *   - BLE built into the esp32 Arduino core — nothing to install
 * If linking fails with "Sketch too big":
 *   Tools → Partition Scheme → "Huge APP (3MB No OTA/1MB SPIFFS)"
 *
 * Wiring (tested, VSPI defaults):
 *   MFRC522  SDA(SS) → GPIO 5
 *   MFRC522  SCK     → GPIO 18
 *   MFRC522  MOSI    → GPIO 23
 *   MFRC522  MISO    → GPIO 19
 *   MFRC522  RST     → GPIO 22
 *   MFRC522  3.3V    → 3V3   (never 5 V!)
 *   MFRC522  GND     → GND
 *   MFRC522  IRQ     → not connected (polling)
 */

#include <SPI.h>
#include <MFRC522.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

/* ── Pins (from the tested sketch) ─────────────────────────── */
#define SS_PIN   5   // SDA / SS / CS on RC522
#define RST_PIN  22  // RST on RC522
#define SCK_PIN  18
#define MISO_PIN 19
#define MOSI_PIN 23
#define LED_PIN  2   // onboard LED on most devkits; blinks on each sent UID

/* ── BLE profile — MUST match app/src/constants/ble.ts ─────── */
#define DEVICE_NAME  "RFID-Jukebox"
#define SERVICE_UUID "6f0e0001-aa1b-4c6e-8a3d-1f2e3c4d5e6f"
#define CHAR_UUID    "6f0e0002-aa1b-4c6e-8a3d-1f2e3c4d5e6f"

/* ── Debounce ──────────────────────────────────────────────── */
// MFRC522 keeps reporting a card while it lies on the reader:
//   different UID than last time → send immediately,
//   same UID → send again only after the cooldown.
const unsigned long COOLDOWN_MS = 2000;

MFRC522 rfid(SS_PIN, RST_PIN);

BLEServer*         bleServer = nullptr;
BLECharacteristic* uidCharacteristic = nullptr;

volatile bool deviceConnected = false;
bool wasConnected = false;

String        lastUid = "";
unsigned long lastSentAt = 0;

/* ── BLE server callbacks ──────────────────────────────────── */
// Advertising stops automatically on connect (guarantees a single
// client); it is restarted from loop() after a disconnect.
class JukeServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* server) override {
    deviceConnected = true;
    Serial.println("BLE: app connected");
  }
  void onDisconnect(BLEServer* server) override {
    deviceConnected = false;
    Serial.println("BLE: app disconnected");
  }
};

String uidToHex(byte* buf, byte len) {
  String s;
  for (byte i = 0; i < len; i++) {
    if (buf[i] < 0x10) s += "0";
    s += String(buf[i], HEX);
    if (i < len - 1) s += ":";
  }
  s.toUpperCase();
  return s;
}

void blinkLed() {
  digitalWrite(LED_PIN, HIGH);
  delay(60);
  digitalWrite(LED_PIN, LOW);
}

void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  /* RFID reader */
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  rfid.PCD_Init();
  Serial.println();
  Serial.print("MFRC522 firmware version: 0x");
  Serial.println(rfid.PCD_ReadRegister(MFRC522::VersionReg), HEX);

  /* BLE GATT server: one service, one NOTIFY characteristic */
  BLEDevice::init(DEVICE_NAME);
  bleServer = BLEDevice::createServer();
  bleServer->setCallbacks(new JukeServerCallbacks());

  BLEService* service = bleServer->createService(SERVICE_UUID);
  uidCharacteristic = service->createCharacteristic(
      CHAR_UUID, BLECharacteristic::PROPERTY_NOTIFY);
  // CCCD (0x2902) — without it the app cannot enable notifications
  uidCharacteristic->addDescriptor(new BLE2902());
  service->start();

  // service UUID in the advertising packet → the app scans for it
  BLEAdvertising* advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(SERVICE_UUID);
  advertising->setScanResponse(true);
  advertising->setMinPreferred(0x06);  // iOS connection-parameter hint
  advertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("BLE: advertising as " DEVICE_NAME);
  Serial.println("Ready. Put a card near the reader...");
}

void loop() {
  /* Restart advertising after a disconnect (give the stack a moment) */
  if (!deviceConnected && wasConnected) {
    delay(500);
    bleServer->startAdvertising();
    Serial.println("BLE: advertising restarted");
    wasConnected = false;
  }
  if (deviceConnected && !wasConnected) {
    wasConnected = true;
  }

  /* Poll the reader */
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    delay(50);
    return;
  }

  String uid = uidToHex(rfid.uid.uidByte, rfid.uid.size);
  unsigned long now = millis();
  bool shouldSend = (uid != lastUid) || (now - lastSentAt > COOLDOWN_MS);

  Serial.print("Card: ");
  Serial.print(uid);

  if (shouldSend && deviceConnected) {
    // raw UID bytes (4–10 B), no encoding — the app builds the hex string
    uidCharacteristic->setValue(rfid.uid.uidByte, rfid.uid.size);
    uidCharacteristic->notify();
    lastUid = uid;
    lastSentAt = now;
    Serial.println("  -> sent over BLE");
    blinkLed();
  } else if (!deviceConnected) {
    Serial.println("  (no app connected, not sent)");
  } else {
    Serial.println("  (cooldown, skipped)");
  }

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

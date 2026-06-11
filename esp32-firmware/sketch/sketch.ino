#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5   // SDA / SS / CS on RC522
#define RST_PIN 22 // RST on RC522

MFRC522 rfid(SS_PIN, RST_PIN);

void setup()
{
    Serial.begin(115200);
    delay(1000);

    // ESP32 VSPI pins:
    // SCK  = GPIO18
    // MISO = GPIO19
    // MOSI = GPIO23
    // SS   = GPIO5
    SPI.begin(18, 19, 23, SS_PIN);

    rfid.PCD_Init();

    Serial.println();
    Serial.println("MFRC522 RFID reader ready.");
    Serial.println("Put RFID card/tag near the reader...");
}

void loop()
{
    if (!rfid.PICC_IsNewCardPresent())
    {
        return;
    }

    if (!rfid.PICC_ReadCardSerial())
    {
        return;
    }

    Serial.println();
    Serial.println("Card detected!");

    Serial.print("UID length: ");
    Serial.print(rfid.uid.size);
    Serial.println(" bytes");

    Serial.print("UID HEX: ");
    for (byte i = 0; i < rfid.uid.size; i++)
    {
        if (rfid.uid.uidByte[i] < 0x10)
        {
            Serial.print("0");
        }

        Serial.print(rfid.uid.uidByte[i], HEX);

        if (i < rfid.uid.size - 1)
        {
            Serial.print(":");
        }
    }
    Serial.println();

    Serial.print("UID DEC: ");
    for (byte i = 0; i < rfid.uid.size; i++)
    {
        Serial.print(rfid.uid.uidByte[i]);

        if (i < rfid.uid.size - 1)
        {
            Serial.print(".");
        }
    }
    Serial.println();

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();

    delay(1000);
}
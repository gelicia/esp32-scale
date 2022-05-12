#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <HTTPClient.h>

const char *ssid = "";
const char *password = "";

// this needs to be from http
String serverName = "";
String authToken = "";

const char *bleAddr = "";

int scanTime = 5; //In seconds
BLEScan *pBLEScan;

//TODO this isnt sufficient to not spam your endpoint - add in some sort of timeout as well
long lastSentImpedance = 0; // keep the last value in here to not send duplicates when scale is done measuring

class MyAdvertisedDeviceCallbacks : public BLEAdvertisedDeviceCallbacks
{
    void onResult(BLEAdvertisedDevice advertisedDevice)
    {
      BLEAddress macAddr = advertisedDevice.getAddress();
      // payload conversion taken from https://github.com/lolouk44/xiaomi_mi_scale
      if (macAddr.equals(BLEAddress(bleAddr)))
      {
        uint8_t *payloadRaw = advertisedDevice.getPayload();
        size_t payloadLength = advertisedDevice.getPayloadLength();
        String payloadString;
        //Serial.printf("Found scale: %s \n", advertisedDevice.toString().c_str());
        Serial.println("found scale");

        // skip first 9 values, payload not relevant to data
        for (int i = 9; i < payloadLength; i++)
        {
          String dataString;
          if (payloadRaw[i] < 16)
            dataString = "0";
          dataString += String(payloadRaw[i], HEX);
          payloadString += dataString;
        }
        Serial.println(payloadString);

        // get stabilized/impedance flags
        uint8_t flagByte = payloadRaw[12];
        boolean isStabilized = flagByte & (1 << 5);
        boolean hasImpedance = flagByte & (1 << 1);
        Serial.printf("Is Stabilized: %s \n", isStabilized ? "true" : "false");
        Serial.printf("Has Impedance: %s \n", hasImpedance ? "true" : "false");

        // convert unit
        String unit = "na";
        String unitHex = payloadString.substring(4, 6);
        if (unitHex.equals("03"))
        {
          unit = "lbs";
        }
        else if (unitHex.equals("02"))
        {
          unit = "kg";
        }
        Serial.println(unit);

        // convert measurement
        char measurementBuffer[5];
        String measurementHex = payloadString.substring(28, 30) + payloadString.substring(26, 28);
        measurementHex.toCharArray(measurementBuffer, 5);
        long measurementInt = strtoul(measurementBuffer, NULL, 16);
        double measurement = measurementInt * 0.01;
        Serial.println(measurement);

        // convert impedance
        char impedanceBuffer[5];
        String impedanceHex = payloadString.substring(24, 26) + payloadString.substring(22, 24);
        impedanceHex.toCharArray(impedanceBuffer, 5);
        unsigned long int impedance = strtoul(impedanceBuffer, NULL, 16);
        boolean isNewMeasurement = impedance != lastSentImpedance;
        Serial.println(impedance);

        if (isStabilized && hasImpedance && isNewMeasurement)
        {
          Serial.println("Sending measurement...");
          if (WiFi.status() == WL_CONNECTED)
          {
            Serial.println("Wifi connected, proceeding...");
            WiFiClient client;
            HTTPClient http;

            // Your Domain name with URL path or IP address with path
            http.begin(client, serverName);

            // Specify content-type header
            http.addHeader("Content-Type", "application/json");
            http.addHeader("Authorization", authToken);
            char jsonBuffer [200];
            sprintf(jsonBuffer, "{\"weight\":%f,\"impedance\":%lu,\"unit\":\"%s\"}", measurement, impedance, unit);
            Serial.println(jsonBuffer);
            int httpResponseCode = http.POST(jsonBuffer);
            if (httpResponseCode == 200) {
              lastSentImpedance = impedance;
            }

            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);

            // Free resources
            http.end();
          }
        }
      }
    }
};

void setup()
{
  Serial.begin(115200);
  Serial.println("Scanning...");
  WiFi.disconnect();
  delay(100);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99); // less or equal setInterval value
}

void loop()
{
  // put your main code here, to run repeatedly:
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!");
  pBLEScan->clearResults(); // delete results fromBLEScan buffer to release memory
  delay(2000);
}
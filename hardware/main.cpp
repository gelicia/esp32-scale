#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

int scanTime = 5; //In seconds
BLEScan* pBLEScan;

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      BLEAddress macAddr = advertisedDevice.getAddress();
      // payload conversion taken from https://github.com/lolouk44/xiaomi_mi_scale
      if (macAddr.equals(BLEAddress("insert address from MiFit App here"))) {
        uint8_t* payloadRaw = advertisedDevice.getPayload();
        size_t payloadLength = advertisedDevice.getPayloadLength();
        String payloadString;
        //Serial.printf("Found scale: %s \n", advertisedDevice.toString().c_str());
        Serial.println("found scale");
        
        // skip first 9 values, payload not relevant to data
        for (int i=9; i<payloadLength; i++) {
          String dataString;
          if (payloadRaw[i] < 16) dataString = "0";
          dataString += String(payloadRaw[i], HEX);
          payloadString += dataString;
        }
        Serial.println(payloadString);

        // get stabilized/impedance flags
        uint8_t flagByte = payloadRaw[12];
        boolean isStabilized = flagByte & (1<<5);
        boolean hasImpedance = flagByte & (1<<1);
        Serial.printf("Is Stabilized: %s \n", isStabilized ? "true" : "false");
        Serial.printf("Has Impedance: %s \n", hasImpedance ? "true" : "false");


        // convert unit
        String unit = "na"; 
        String unitHex = payloadString.substring(4, 6);
        if (unitHex.equals("03")) {
           unit = "lbs";
        } else if (unitHex.equals("02")) {
          unit = "kg";
        }
        Serial.println(unit);

        // convert measurement
        char measurementBuffer[5];
        String measurementHex = payloadString.substring(28,30) + payloadString.substring(26,28);
        measurementHex.toCharArray(measurementBuffer, 5);
        long measurementInt = strtoul(measurementBuffer, NULL, 16);
        double measurement = measurementInt * 0.01;
        Serial.println(measurement);

        // convert impedance
        char impedanceBuffer[5];
        String impedanceHex = payloadString.substring(24,26) + payloadString.substring(22,24);
        impedanceHex.toCharArray(impedanceBuffer, 5);
        long impedance = strtoul(impedanceBuffer, NULL, 16); 
        Serial.println(impedance);
      }
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Scanning...");

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value
}

void loop() {
  // put your main code here, to run repeatedly:
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!");
  pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  delay(2000);
}

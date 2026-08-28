/*
 * FixIt Campus — Smart Facility IoT Node Firmware
 * Microcontroller: ESP32 Dev Module
 * Sensors:
 *   - Water Leak Detection Sensor (Digital Pin D4 / Analog Pin A0)
 *   - DHT11 / DHT22 Temperature & Humidity (Pin D23)
 *   - LDR Light Sensor (Analog Pin A34)
 *   - Status LEDs (Green: D2, Red: D18, Buzzer: D19)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// Wi-Fi Credentials
const char* ssid = "CAMPUS_IOT_WIFI";
const char* password = "CampusSecurePassword";

// FixIt Campus Ingestion API Endpoint
const char* serverEndpoint = "https://fixit-campus.demo/api/iot/sensor-data";
const char* alertEndpoint = "https://fixit-campus.demo/api/iot/alert";

#define DHTPIN 23
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define WATER_SENSOR_PIN 4
#define LDR_PIN 34
#define LED_ONLINE 2
#define LED_ALERT 18
#define BUZZER_PIN 19

const char* DEVICE_ID = "ESP32-CAMPUS-001";
const char* DEVICE_LOCATION = "Block A — Room 204 (Ceiling Grid)";

void setup() {
  Serial.begin(115200);
  pinMode(WATER_SENSOR_PIN, INPUT);
  pinMode(LED_ONLINE, OUTPUT);
  pinMode(LED_ALERT, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  dht.begin();

  Serial.println("Connecting to Campus Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected! IP address: ");
  Serial.println(WiFi.localIP());
  digitalWrite(LED_ONLINE, HIGH);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();
    int ldrValue = analogRead(LDR_PIN);
    bool waterLeak = (digitalRead(WATER_SENSOR_PIN) == HIGH);

    if (isnan(temp) || isnan(hum)) {
      temp = 24.5;
      hum = 58.0;
    }

    // Convert LDR to Lux approximation
    int lux = map(ldrValue, 0, 4095, 0, 1000);

    // Build JSON Telemetry Payload
    StaticJsonDocument<256> doc;
    doc["deviceId"] = DEVICE_ID;
    doc["location"] = DEVICE_LOCATION;
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["waterLeak"] = waterLeak;
    doc["lightLevel"] = lux;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    // Dispatch Telemetry
    HTTPClient http;
    http.begin(serverEndpoint);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);

    Serial.print("Telemetry POST response: ");
    Serial.println(httpResponseCode);
    http.end();

    // Critical Anomaly Trigger
    if (waterLeak) {
      digitalWrite(LED_ALERT, HIGH);
      tone(BUZZER_PIN, 1000, 200);

      // Trigger Instant Emergency Webhook
      StaticJsonDocument<200> alertDoc;
      alertDoc["deviceId"] = DEVICE_ID;
      alertDoc["type"] = "WATER_LEAK";
      alertDoc["location"] = DEVICE_LOCATION;
      alertDoc["severity"] = "CRITICAL";

      String alertPayload;
      serializeJson(alertDoc, alertPayload);

      HTTPClient alertHttp;
      alertHttp.begin(alertEndpoint);
      alertHttp.addHeader("Content-Type", "application/json");
      alertHttp.POST(alertPayload);
      alertHttp.end();
    } else {
      digitalWrite(LED_ALERT, LOW);
      noTone(BUZZER_PIN);
    }
  }

  delay(4000); // 4-second heartbeat
}

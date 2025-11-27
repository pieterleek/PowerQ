#include <WiFi.h>
#include <HTTPClient.h>
#include "EmonLib.h"

// --- CONFIGURATIE ---
const char *ssid = "";
const char *password = "";
const char *serverUrl = "http://192.168.1.50:3000/api/measurements";
const char *deviceId = "esp32_device_01"; // Unieke ID voor dit apparaat
const char *API_SECRET = "Bearer XXXXX";  // Vul hier de API sleutel in

// Pin Definitie
const int ADC_INPUT = 34; // GPIO 34 (Analog ADC1_CH6)

// 111.1 is een standaard startwaarde voor veel ZMCT modules
const double CALIBRATION_VAL = 111.1;

// Instantie van de EnergyMonitor
EnergyMonitor emon1;

// Timing variabelen (voor de 0.5s interval zonder delay)
unsigned long previousMillis = 0;
const long interval = 500;

void setup()
{
    Serial.begin(115200);

    // 1. Initialiseer WiFi
    WiFi.begin(ssid, password);
    Serial.print("Verbinden met WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi verbonden!");
    Serial.print("IP adres: ");
    Serial.println(WiFi.localIP());

    // Initialiseer EmonLib
    // current(pin, calibration_constant)
    emon1.current(ADC_INPUT, CALIBRATION_VAL);
}

void loop()
{
    unsigned long currentMillis = millis();

    // Controleer of er 500ms voorbij zijn
    if (currentMillis - previousMillis >= interval)
    {
        previousMillis = currentMillis;

        // Bereken Irms (Root Mean Square stroom)
        // 1480 is het aantal samples (afgestemd op ong. 20ms golflengte van 50Hz)
        double Irms = emon1.calcIrms(1480);

        // Filter ruis (soms geeft hij 0.05A terwijl er niets aan staat)
        if (Irms < 0.10)
        {
            Irms = 0.0;
        }

        // Aanname: Spanning is 230V
        float voltage = 230.0;

        if (WiFi.status() == WL_CONNECTED)
        {
            HTTPClient http;
            http.begin(serverUrl);
            http.addHeader("Content-Type", "application/json");
            http.addHeader("Authorization", API_SECRET);

            // Bouw de JSON string (Clean & Simpel)
            String jsonPayload = "{";
            jsonPayload += "\"deviceId\":\"" + String(deviceId) + "\"";
            jsonPayload += "\"current\":" + String(Irms, 2) + ",";
            jsonPayload += "\"voltage\":" + String(voltage, 1) + ",";

            jsonPayload += "}";

            // Stuur de POST
            int httpResponseCode = http.POST(jsonPayload);

            if (httpResponseCode == 401 || httpResponseCode == 403)
            {
                Serial.println("No access,  Check API Key.");
            }
            else if (httpResponseCode > 0)
            {
                // Succes (201 of 200)
            }
            else
            {
                Serial.printf("Fout bij verzenden: %s\n", http.errorToString(httpResponseCode).c_str());
            }

            http.end();
        }
        else
        {
            Serial.println("WiFi verloren...");
        }
    }
}
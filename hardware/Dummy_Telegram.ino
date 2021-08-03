// This Software is written to act like an Dummy P1 Smart Meter Telegram output.
// Its written to test several functions in the Parser script.
// At the time of writting the script i was unable to have constant access to the Smart Meter
// Written for DSM 2.2 Telegrams.
// Written 28-06-2021 by Jacco Veldscholten

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println("/KMP5 ZABF001551793811");
  Serial.println("");
  Serial.println("0-0:96.1.1(205A414246303031353531373933383131)");
  Serial.println("1-0:1.8.1(30652.450*kWh)");                                   // +T1 = 30652 Kwh  (Teller stand dal)        Afgenomen stroom daltarief 
  Serial.println("1-0:1.8.2(26737.774*kWh)");                                   // +T2 = 26737 Kwh  (Teller stand piek)       Afgenomen stroom piektarief 
  Serial.println("1-0:2.8.1(00409.829*kWh)");                                   // -T1 = 409 Kwh    (Terug teller stand dal)  Teruggeleverde stroom daltarief
  Serial.println("1-0:2.8.2(00939.132*kWh)");                                   // -T2 = 939 Kwh    (Terug teller stand piek) Teruggeleverde stroom piektarief
  Serial.println("0-0:96.14.0(0001)");                                          // Actueel verbruik (Dal). 1 = dal. 0 = piek
  Serial.println("1-0:1.7.0(0001.59*kW)");                                      // Huidige verbruik (1.59 kW)
  Serial.println("1-0:2.7.0(0000.11*kW)");                                      // Huidige teruglevering (0.11kW)                 
  Serial.println("0-0:96.13.0()");                                              // Niet relevante M-bus informatie
  Serial.println("0-1:24.1.0(3)");                                              // Aantal apparaten op de M-Bus
  Serial.println("0-1:96.1.0(3238313031353431303031323639323131)");             // Andere apparten op bus 
  Serial.println("0-1:24.3.0(210627190000)(08)(60)(1)(0-1:24.2.1)(m3)");        // Gas informatie. Niet relevant.
  Serial.println("(25210.782)");                                                // Teller stand Gas (25210) in M3
  Serial.println("!");

  // De orginele meter stuurt elke 10 seconden een bericht.
  // Voor debug loopt deze nu op 3 seconden
  delay(10000); // 3000 milliseconds = 3 sec.
}

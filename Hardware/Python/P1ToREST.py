#!/usr/bin/env python
# Python script om P1 telegram weer te geven
 
import re
import serial
import json
import time
import requests


# Constants Configuration
api = "http://localhost/measurements"
token = "eyJhbGciOiJ"
jsonAPI = {"meter_name" : "meter1", "token": token}

# Seriele poort confguratie
ser = serial.Serial()
 
# DSMR 2.2 > 9600 7E1:
ser.baudrate = 9600
ser.bytesize = serial.EIGHTBITS
ser.parity = serial.PARITY_NONE
ser.stopbits = serial.STOPBITS_ONE
 
# DSMR 4.0/4.2 > 115200 8N1:
#ser.baudrate = 115200
#ser.bytesize = serial.EIGHTBITS
#ser.parity = serial.PARITY_NONE
#ser.stopbits = serial.STOPBITS_ONE
 
ser.xonxoff = 0
ser.rtscts = 0
ser.timeout = 12
ser.port = "/dev/cu.usbserial-1420"
ser.close()
 

while True:
    ser.open()
    checksum_found = False
 
    while not checksum_found:
        telegram_line = ser.readline()                  # Read out Serial Line
        #print(telegram_line.decode('ascii').strip())
 
 
        ## Meterstand stroom dal (afgenomen)
        if re.match(b'1-0:1.8.1', telegram_line):
            plusT1 = telegram_line[10:-7].decode('ascii').strip()
            plusT1 = float(plusT1)
            jsonAPI.update({'electric_consumption_low': plusT1})
            print("+T1 Afgenomen stroom dal: " + str(plusT1) + " kWh")

        ## Meterstand stroom Piek (afgenomen)
        if re.match(b'1-0:1.8.2', telegram_line):
            plusT2 = telegram_line[10:-7].decode('ascii').strip()
            plusT2 = float(plusT2)
            jsonAPI.update({'electric_consumption_high': plusT2})
            print("+T2 Afgenomen stroom piek: " + str(plusT2) + " kWh")
        
        ## Meterstand stroom Dal (teruggave)
        if re.match(b'1-0:2.8.1', telegram_line):
            minT1 = telegram_line[10:-7].decode('ascii').strip()
            minT1 = float(minT1)
            jsonAPI.update({'electric_yield_low': minT1})
            print("-T1 Afgenomen stroom dal: " + str(minT1) + " kWh")
        
        ## Meterstand stroom piek (teruggave)
        if re.match(b'1-0:2.8.2', telegram_line):
            minT2 = telegram_line[10:-7].decode('ascii').strip()
            minT2 = float(minT2)
            jsonAPI.update({'electric_yield_high': minT2})
            print("-T2 Afgenomen stroom piek: " + str(minT2) + " kWh")

        ## Huidige verbruikstand
        if re.match(b'0-0:96.14.0', telegram_line):
            billing = telegram_line[12:-3].decode('ascii').strip()
            billing = float(billing)
            if billing > 0:
                jsonAPI.update({'tariff': "low"})
                print("Huidge tarief : Dal tarief")
            else:
                jsonAPI.update({'tariff': "high"})
                print("Huidige tarief: Piek")

        ## Huidig verbruik
        if re.match(b'1-0:1.7.0', telegram_line):
            currentUse = telegram_line[12:-6].decode('ascii').strip()
            currentUse = float(currentUse)
            jsonAPI.update({'electric_consumption_current': currentUse})
            print("Huidig verbruik " + str(currentUse) + " kWh")      

        ## Huidig teruggave
        if re.match(b'1-0:2.7.0', telegram_line):
            currentYield = telegram_line[12:-6].decode('ascii').strip()
            currentYield = float(currentYield)
            jsonAPI.update({'electric_yield_current': currentYield})
            print("Huidig teruggave " + str(currentYield) + " kWh")    

        ## Huidige gas stand
        if re.match(b'0-1:24.3.0', telegram_line):
            # We dont need this line. We need the next one
            gas = ser.readline()[1:-3].decode('ascii').strip()
            jsonAPI.update({'gas_consumption': gas})
            print("Huidig gas stand " + str(gas) + " m3")   

    # Check wanneer het uitroepteken ontvangen wordt (einde telegram)
        if re.match(b'(?=!)', telegram_line):
            checksum_found = True
            #ser.close()
    ser.close()

    requestReturn = requests.post(api, json=jsonAPI)
    json_dump = json.dumps(jsonAPI, indent=4)         # Dump Json
    
    print(requestReturn)                    # Check errors for Requests
    print(json_dump)                        # Print out JSON for Debug

    time.sleep(5)                           # Slow down Fetching data
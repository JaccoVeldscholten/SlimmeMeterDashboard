
import serial
import time
import re

# make sure the 'COM#' is set according the Windows Device Manager
ser = serial.Serial('COM5', 9800, timeout=0)
time.sleep(2)
ser.close()
ser.open()
while True:
    data_raw = ser.readline().decode('ascii').strip()
    if data_raw:
        print(data_raw)
 

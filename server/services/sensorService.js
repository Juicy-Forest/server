const SensorReading = require('../models/SensorReading');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

async function createReading(data) {
    return await SensorReading.create(data);
}

function startSensorIngest(portPath = '/dev/ttyACM0', baudRate = 9600) {
    
    console.log(`[SensorService] Attempting to connect to port: ${portPath} @ ${baudRate} baud.`);
    
    const port = new SerialPort({ path: portPath, baudRate: baudRate });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' })); 
    
    port.on('error', (err) => {
        console.error('[SensorService] Serial Port Error:', err.message);
    });

    parser.on('data', async (data) => {
        const jsonString = data.trim();
        
        if (!jsonString) {
            return console.warn('[SensorService] Received empty data, ignoring.');
        }

        let readingData;
        try {
            readingData = JSON.parse(jsonString);
            
            if (!readingData.hasOwnProperty('humidity') || 
                !readingData.hasOwnProperty('temperature') ||
                !readingData.hasOwnProperty('sunIntensity') || 
                !readingData.hasOwnProperty('soilMoisture')) 
            {
                return console.warn('[SensorService] JSON missing required fields, ignoring:', readingData);
            }
            await createReading(readingData);
            
        } catch (error) {
            console.error('[SensorService] Failed to parse JSON or save reading:', error.message, 'Raw data:', jsonString);
        }
    });

    return port; 
}

module.exports = {
    startSensorIngest,
    createReading,
};
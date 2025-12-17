const Sensor = require('../models/Sensor');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const serialPortPath = process.env.SERIAL_PORT_PATH || "/dev/ttyACM0";

function startListeningOnSerialPort() {
    const port = new SerialPort({ path: serialPortPath, baudRate: 9600 });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

    port.on('open', () => console.log(`Serial port open on ${serialPortPath}`));
    parser.on('data', async (data) => {
        const parsedData = JSON.parse(data);
        await postSensorData(parsedData);
    });
}

async function getSensorData() {
    return await Sensor.find({});
}

async function postSensorData(data) {
    return await Sensor.create(data)
}

module.exports = {
    getSensorData,
    startListeningOnSerialPort
}
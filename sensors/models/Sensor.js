const { model, Schema } = require('mongoose');

const sensorSchema = new Schema({
    temperature: {
        type: Number
    },
    humidity: {
        type: Number
    }
});

const Sensor = model("Sensor", sensorSchema);

module.exports = Sensor;
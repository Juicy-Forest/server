const { Schema, model } = require('mongoose');

const sensorReadingSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    humidity: {
        type: Number,
        min: 0,
        max: 100
    },
    temperature: {
        type: Number,
    },
    sunIntensity: {
        type: Number,
        min: 0
    },
    soilMoisture: {
        type: Number,
        min: 0
    }
});

sensorReadingSchema.index({ timestamp: -1 });

const SensorReading = model('SensorReading', sensorReadingSchema);

module.exports = SensorReading;
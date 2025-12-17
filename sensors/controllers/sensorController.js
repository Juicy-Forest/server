const sensorController = require('express').Router();
const sensorService = require('../services/sensorService');

sensorController.get('/', async (req, res) => {
    try {
        const sensorData = await sensorService.getSensorData();
        res.status(200).send(sensorData);
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

module.exports = sensorController;

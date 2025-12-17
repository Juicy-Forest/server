const router = require('express').Router();
const sensorController = require('./controllers/sensorController');

router.use('/sensors', sensorController);

module.exports = router;
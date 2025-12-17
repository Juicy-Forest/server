const express = require('express');
const app = express();
const cors = require('cors')
const router = require('./routes');
const initDatabase = require('./configs/database');
const sensorService = require('./services/sensorService');
const webConstants = require('./web-constants');

app.use(cors({credentials: true, origin: 'http://localhost:5173', allowHeaders: ['Content-Type, X-Authorization']}));
app.use(express.json());
app.use(router);
initDatabase()
.then(() => {
    app.listen(webConstants.PORT, () => console.log(`Server listening on http://localhost:${webConstants.PORT}`))
    sensorService.startListeningOnSerialPort();
});

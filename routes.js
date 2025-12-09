const router = require('express').Router();
const authController = require('./controllers/authController');
const inventoryController = require('./controllers/inventoryController');
const tasksController = require('./controllers/taskController');

router.use('/users', authController);
router.use('/inventory', inventoryController)
router.use('/tasks', tasksController);
    
module.exports = router;
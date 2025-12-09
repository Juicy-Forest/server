const Task = require('../models/Tasks');

async function getTask() {
    return await Task.find({});
}

async function createTask(data) {
    return await Task.create(data);
}

async function updateTask(id, data) {
    return await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteTask(id) {
    return await Task.findByIdAndDelete(id);
}

module.exports = {
    getTask,
    createTask,
    updateTask,
    deleteTask,

}

const mongoose = require('mongoose');


//TODO: CHANGE DB LINK

function initDatabase(){
    return mongoose.connect("mongodb://localhost:00000/project-name")
}

module.exports = initDatabase;
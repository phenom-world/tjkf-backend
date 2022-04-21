const mongoose = require('mongoose');

const TeamRequestSchema = new  mongoose.Schema({
    teamname : {
        type: String,
        required: [true, "Please type a message"]
    },
    username : {
        type: String,
        required: [true, "Input your username"]
    },
    userId: {
        type : String,
        required: [true, "Input your username"]
    },
    timestamp : {
        type : Date,
        default : Date.now()
    },
})

module.exports = mongoose.model('teamrequests', TeamRequestSchema);
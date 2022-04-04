const mongoose = require('mongoose');

const TeamMessageSchema = new  mongoose.Schema({
    message : {
        type: String,
        required: [true, "Please type a message"]
    },
    username : {
        type: String,
        required: [true, "Input your username"]
    },
    team: {
        type : mongoose.Schema.ObjectId,
        ref : "Teams",
        required: true
    },
    timestamp : {
        type : Date,
        default : Date.now()
    },
})

module.exports = mongoose.model('teammessages', TeamMessageSchema);
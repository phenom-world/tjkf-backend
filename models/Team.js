const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamname : {
        type: String,
        required: [true, "Team Name already in use"],
        unique: true,
    },
    creator : {
        type: String
    },
    userNames:[{
        type: String,
    }],
    statecode : {
        type: String,
        unique: true,
    },
    timestamp : {
        type : Date,
        default : Date.now()
    },
})

module.exports = mongoose.model('teams', TeamSchema);
const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
    toId : {
        type : mongoose.Schema.ObjectId,
        ref : "Users",
        required: true
    },
    fromId : {
        type : mongoose.Schema.ObjectId,
        ref : "Users",
        required: true
    },
    partiesInvolved : {
        type : Array
    },
    toProfilephoto : {
        type: String
    },
    toUsername : {
        type: String
    },
    // relationship : {
    //     type: String,
    //     enum : ["Request", "Friends", "Block"],
    //     default: "Request"
    // }
},{
    timestamps: true
})

module.exports = mongoose.model('relationships', RelationshipSchema);
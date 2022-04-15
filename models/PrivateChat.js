const mongoose = require('mongoose');

const PrivateChatSchema = new mongoose.Schema({
    fromusername : {
        type: String,
        required: true
    },
    tousername : {
        type: String,
        required: true
    },
    message : {
        type : String,
        required: true
    },
    isStarred : {
        type : Boolean,
        default: false
    }
},{
    timestamps : true
})

module.exports = mongoose.model("PrivateChat", PrivateChatSchema);
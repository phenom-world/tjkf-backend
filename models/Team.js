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
    userIds : {
        type: Array,
        default: []
    },
    statecode : {
        type: String,
        unique: true,
    },
    teamphoto: {
        type: String,
        default: "https://media.istockphoto.com/vectors/pastel-map-of-nigeria-vector-id1315482197"
    },
    coverphoto: {
        type: String,
        default: "https://media.istockphoto.com/photos/nigerian-flag-map-picture-id495144439?k=20&m=495144439&s=612x612&w=0&h=Zz9ddTVR9O2pg03fv-ks9cVBI9n_VWzmPTi7jsIZV_I="
    }
},{
    timestamp : true
})

module.exports = mongoose.model('teams', TeamSchema);
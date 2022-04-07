const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required : [true,'Please add your firstname']
    },
    lastname : {
        type : String,
        required : [true,'Please add your lastname']
    },
    phone : {
        type : String,
        required : [true,'Please add your phone number']
    },
    state : {
        type : String,
        required : [true,'Please add your state']
    },
    statecode : {
        type : String,
        required: [true, "state code is required"]
    },
    tjkfid : {
        type : String,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    lga : {
        type : String,
        required : [true,'Please add your lga']
    },
    username : {
        type : String,
        required : [true,'Please add a username'],
        unique : true,
    },
    gender : {
        type : String,
        required : [true,'Please select a gender'],
        enum : ['male', 'female'],
    },
    email : {
        type : String,
        required : [true,'Please add an email address'],
        unique : true,
        match : [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please input a valid email']
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    password : {
        type : String,
        required : [true,'Please add a password'],
        minlength : 6,
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    maritalStatus : {
        type: String,
        enum : ['Married', 'Single', 'Widow', 'Widower', 'Divorced'],
    },
    educationStatus : {
        type: String,
        enum : ['Olevel', 'National Diploma', 'Higher National Diploma', 'BSc.', 'MSc.', "PHD"],
    },
    employmentStatus : {
        type: String,
        enum: ['Employed', 'Self Employed', 'Non-Employed'],
    },
    politicalInterest : {
        type: String,
        enum: ["Non Partisan", "Partisan", "Indifferent"]
    },
    electoralParticipation : {
        type: String,
        enum: ["Regularly", "Occassionally", "Indifferent"]
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

//Encrypt the password
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next();
})

let modal;
UserSchema.pre('save', function(next) {
    if (this.isNew) {
        if (!modal) {
        modal = mongoose.model('User');
        }
        modal.find({})
        .then((entries) => {
            let val = entries.length + 1;
            this.tjkfid = `TJKF/${this.statecode}/0${val}`;
            next();
        })
    }
});

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema);
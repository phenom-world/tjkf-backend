const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../utilities/generateToken.js');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utilities/sendMail.js');
const crypto = require('crypto');

exports.login = asyncHandler(async(req, res) => {
    const {username, password} = req.body
    
    const user = await User.findOne({username});
    

    if(user && (await user.matchPassword(password))){
        if(user.isVerified){
            res.json({
                success : true,
                token: generateToken(user._id)
            })
        }else{
            res.status(401)
            throw new Error(`Unverified Account`);
        }
    }else{
        res.status(401)
        throw new Error(`Invalid username or password`);
    }
})

exports.register = asyncHandler(async(req, res) => {
    const {email, password, firstname, lastname, state, statecode, lga, phone, gender, username} = req.body
    
    const userExists = await User.findOne({username})

    if(userExists){
        res.status(400)
        throw new Error(`User already exists`)
    }

    const user = await User.create({email, password, firstname, lastname, state, statecode, lga, phone, gender, username})

    if(user){
        const verifyToken = user.getSignedJwtToken();
        const resetURL = `https://team-jkf.netlify.app/verify/${verifyToken}`
        mailSender(resetURL, user, res, "Team JKF: Email Verification", "Team JKF: Email Verification", "You must confirm/validate your Email Account before logging in.");
        console.log(verifyToken);
    }else{
        res.status(400);
        throw new Error(`Invalid User data`);
    }
})

exports.verifyUser = asyncHandler(async(req, res) => {
    const {token} = req.params;
    const id = verifyToken(token, res);
    if(id){
        User.updateOne(
            { _id : id},
            {
                $set: {
                    isVerified: true
                }
            },
            (response,err)=>{
                User.findById(id).then((user)=>{
                    mailSender("", user, res,"Team JKF: Email Verification Successful", "Team JKF: Email Verification Successful", "Your account is now verified at Team JKF." );
                }).catch(err=> {
                    res.status(401)
                    throw new Error(`${err}`);
                })
            }
        )
    }
})

exports.resendVerificationLink = asyncHandler(async(req, res) => {
    const { email } = req.body
    const user = await User.findOne({email});
    if(user){
        const verifyToken = user.getSignedJwtToken();
        const resetURL = `https://tender-lalande-27459e.netlify.app/tjkf/users/verify/${verifyToken}`
        mailSender(resetURL, user, res, "Team JKF: Email Verification", "Team JKF: Email Verification", "You must confirm/validate your Email Account before logging in.")
    }else{
        res.status(400);
        throw new Error(`Invalid User data`);
    }
})

exports.logout = asyncHandler(async(req, res) => {
    res.cookie('token','none',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly : true
    })

    res.status(200).json({success : true , data : 'Logged out'});
})

exports.getMe = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401)
        throw new Error(`User already exists`)
    }else{
        const userData = {
            id : user._id,
            firstname : user.firstname,
            username : user.username,
            email : user.email,
            lastname : user.lastname,
            state : user.state,
            statecode : user.statecode,
            lga : user.lga,
            phone : user.phone,
            gender : user.gender,
            isAdmin : user.isAdmin,
            tjkfid: user.tjkfid,
            createdAt : user.createdAt,
        }
        res.json({
            success : true,
            data: userData
        })
    }
})

exports.updatePassword = asyncHandler(async(req, res) => {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.newPassword,salt);
    
    User.findOne({_id: req.user.id}).then((data,err)=>{
        if (data){
            data.matchPassword(req.body.currentPassword).then(resp=>{
                if(resp){
                    User.updateOne(
                        { _id : data._id},
                        {
                            $set: {
                                password: newPassword
                            }
                        },
                        (response,err)=>{
                            User.findById(data._id).then((user)=>{
                                return res.status(200).json({success : true, data: generateToken(user._id)})
                            }).catch(err => {
                                res.status(401)
                                throw new Error(`${err}`);
                            })
                        }
                    )
                }else {
                    res.status(401)
                    throw new Error(`Incorrect credentials`);
                }
            })
        }else{
            res.status(404)
            throw new Error(`User not found`);
        }
        
    })

});

exports.updateProfile = asyncHandler(async(req, res) => {
    const {email, firstname, lastname, state, statecode, lga, phone, gender, username, maritalStatus, educationStatus, employmentStatus, politicalInterest, electoralParticipation } = req.body
    const user = await User.findById(req.user._id)
    if(user){
        try{
            await User.updateOne({ _id : user._id}, 
                {$set: 
                    {
                        firstname : firstname || user.firstname,
                        username : username || user.username,
                        email : email || user.email,
                        lastname : lastname || user.lastname,
                        state : state || user.state,
                        statecode : statecode || user.statecode,
                        lga : lga || user.lga,
                        phone : phone || user.phone,
                        gender : gender || user.gender,
                        maritalStatus: maritalStatus || user.maritalStatus,
                        educationStatus : educationStatus || user.educationStatus,
                        employmentStatus : employmentStatus || user.employmentStatus,
                        politicalInterest : politicalInterest || user.politicalInterest,
                        electoralParticipation : electoralParticipation || user.electoralParticipation,
            }});
            res.json({
                success : true,
                token: generateToken(user._id)
            })
        }catch(err){
            res.status(404)
            throw new Error(`${err}`);
        }

    }else{
        res.status(404)
        throw new Error(`User not found`)
    }
});

exports.forgotPassword = asyncHandler(async(req, res) => {
    const { email } = req.body;
    if(email){
        const user  = await User.findOne({ email});
        if(user){
            const resetToken = crypto.randomBytes(20).toString('hex');
            const resetTokenURL = crypto.createHash('sha256').update(resetToken).digest('hex');
            console.log(resetToken);
            User.updateOne(
                { email : email},
                {
                    $set: {
                        resetPasswordToken: resetTokenURL,
                        resetPasswordExpire: Date.now() + 10 * 60 * 1000,
                    }
                },
                (response,err)=>{
                    User.findById(user._id).then((user)=>{
                        const resetURL = `https://team-jkf.netlify.app/resetPassword/${resetToken}`
                        mailSender(resetURL, user, res,"Team JKF: Reset Password", "Team JKF: Reset Password", "You are receiving this mail because you or someone else has requested the reset of password" );
                    })
                }
            )
        }else{
            res.status(404);
            throw new Error(`User not found`);
        }
    }else{
        res.status(400);
        throw new Error(`Please input a valid email address`);
    }
});

exports.resetPassword = asyncHandler(async(req, res) => {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password,salt);
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    console.log(resetPasswordToken)
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire : {$gt :Date.now()}});
    if(user){
        try{
            await User.updateOne(
                { resetPasswordToken, resetPasswordExpire : {$gt :Date.now()} },
                {
                    $set: {
                        password : newPassword,
                    }, 
                    $unset: {
                        resetPasswordToken: 1,
                        resetPasswordExpire: 1,
                    }
                }
            );
            return res.status(200).json({success: true, message: "Password reset successful"})
        }catch(err){
            res.status(400)
            throw new Error(err);
        }
    }else{
        res.status(404)
        throw new Error(`User not found `);
    }
})

function messageToBeSent (title, resetURL, user){
    if(title === "Team JKF: Email Verification"){
        return `<p>Please click on the following link to successfully activate your account:<a style="color:#c4c423;" href=${resetURL}>click here</a></p>`
    }else if(title === "Team JKF: Reset Password"){
        return `<p>Please click on the following link to successfully reset your password:<a style="color:#c4c423;" href=${resetURL}>click here</a></p>`
    }else if (title === "Team JKF: Email Verification Successful"){
        return `<p>Unique ID: ${user.tjkfid}</p>`
    }
}

function mailSender (resetURL, user, res, subject, title, body){
    sendMail({
        email: `${user.email}`,
        subject: `${subject}`,
        html: `<div style="color:white;background-color:black" >
                    <div style="padding:1rem" >
                        <h3>${title}</h3>
                        <p><b>Hi ${user.firstname} ${user.lastname}</b>,</p>
                        <p${body}</p>
                        ${messageToBeSent(title, resetURL, user)}
                        <h4 style="padding-top:1rem" >Have a nice day!</h4>
                    </div>
                </div>
                `
    }, res);
}
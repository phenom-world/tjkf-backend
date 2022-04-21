const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token){
        token = req.cookies.token;
    }

    //Make sure the token is valid
    if(!token){
        res.status(401)
        throw new Error('Not authorized to access this route');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = await User.findById(decoded.id);
        if(!req.user.isVerified){
            res.status(401)
            throw (new Error('Not authorized to access this route'))
        }
        next();
    } catch (error) {
        res.status(401)
        throw new Error('Not authorized to access this route');
    }
})

exports.admin = asyncHandler(async(req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401)
        throw new Error(`Not authorized to access this route`);
    }
})
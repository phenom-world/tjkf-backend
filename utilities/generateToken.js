const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIREII
    })
}

exports.verifyToken = (token, res) => {
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    }catch(error){
        console.log(error);
        return res.status(404).json({success : false, message: `${error}`});
    }
}
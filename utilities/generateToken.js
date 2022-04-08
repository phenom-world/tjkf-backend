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
        res.status(401)
        throw new Error(`${error}`);
    }
}
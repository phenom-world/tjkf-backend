const PrivateChat = require('../models/PrivateChat');
const asyncHandler = require('express-async-handler');

exports.sendMessage = asyncHandler(async(req, res)=>{
    const { fromusername, tousername, message } = req.body;
    if(req.user.username === fromusername){
        try{
            let chat;
            if(fromusername && tousername&& message){
                chat = await PrivateChat.create({fromusername, tousername, message});
            }
            res.status(201).json({success: true, data: chat})
        }catch(err){
            res.status(403)
            throw new Error(`${err}`);
        }   
    }else{
        res.status(403)
        throw new Error(`You are not permitted to perform this operation`)
    }
});

exports.receivedMesages = asyncHandler(async( req, res )=>{
    try{
        const chat = await PrivateChat.find({ tousername: req.user.username })
        res.status(200).json({success: true, data: chat})
    }catch(err){
        res.status(401)
        throw new Error(`${err}`);
    }
});

exports.sentMesages = asyncHandler(async( req, res )=>{
    try{
        const chat = await PrivateChat.find({ fromusername: req.user.username })
        res.status(200).json({success: true, data: chat})
    }catch(err){
        res.status(401)
        throw new Error(`${err}`);
    }
});

exports.starOrUnstarMessage = asyncHandler(async(req,res) =>{
    try{
        const chat = await PrivateChat.findById(req.params.id)
        if(chat){
            const updatedChat = await PrivateChat.findByIdAndUpdate(req.params.id,{
                isStarred : !chat.isStarred
            });
            res.status(200).json({success: true, data: updatedChat});
        }
    }catch(err){
        res.status(401)
        throw new Error(`${err}`);
    }
} )
const TeamMessage = require('../models/TeamMessage');
const Team = require('../models/Team');
const asyncHandler = require('express-async-handler');

exports.sendMessage = asyncHandler(async(req, res) => {
    req.body.team = req.params.id;
    req.body.username = req.user.username;
    Team.findById(req.params.id,(err, data) => {
        if(err){
            res.status(500);
            throw new Error(err);
        }
        else if(data){
            if(data.userNames.includes(req.body.username)){
                TeamMessage.create(req.body,(err, message) => {
                    if(err)res.status(500).send(err)
                    else{
                        res.status(201).json({success: true, message})
                    }
                });
            }else{
                res.status(500);
                throw new Error("Not Authorized to send message to this group");
            }
        }
    })
});

exports.getMessageByRoom = asyncHandler(async(req, res) => {
    TeamMessage.find({ team: req.params.id}, (err, message) => {
        if(err){
            res.status(500);
            throw new Error(err);
        }
        else{
            res.status(200).json({success: true, message});
        }
    })
});
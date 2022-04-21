const TeamMessage = require('../models/TeamMessage');
const Team = require('../models/Team');
const asyncHandler = require('express-async-handler');

exports.sendMessage = asyncHandler(async(req, res) => {
    req.body.team = req.params.id;
    req.body.username = req.user.username;
    try{
        const team = await Team.findById(req.params.id);
        if(team){
            if(team.userNames.includes(req.body.username)){
                TeamMessage.create(req.body,(err, message) => {
                    if(err)res.status(500).send(err)
                    else{
                        res.status(201).json({success: true, message})
                    }
                });
            }else{
                res.status(403);
                throw new Error("Not Authorized to send message to this group");
            }
        }else{
            res.status(404);
            throw new Error("Team does not exist");
        }
    }catch(err){
        res.status(400);
        throw new Error(`${err}`);
    }
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
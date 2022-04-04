const Team = require('../models/Team');
const asyncHandler = require('express-async-handler');


exports.createTeam = asyncHandler(async(req, res) => {
    req.body.creator = req.user.username;
    const { teamname, creator, statecode, userNames } = req.body;
    if(teamname && creator) {
        const teamExists = await Team.findOne({teamname});
        if(teamExists){
            throw new Error(`Team Already Exists`);
        }else{
            try{
                const team = await Team.create({teamname, creator, statecode, userNames : [creator, ...userNames]});
                if(team){
                    res.status(201).json({success: true, data: team});
                }else{
                    res.status(401)
                    throw new Error(`Invalid Details`);
                }
            }catch(err){
                res.status(400)
                throw new Error(`${err}`);
            }
        }
    }else{
        res.status(401)
        throw new Error(`Invalid Details`);
    }
});

exports.getAllTeams = asyncHandler(async(req, res) => {
    try{
        const teams = await Team.find({});
        res.status(200).json({success: true, data : teams})
    }catch(err){
        res.status(401)
        throw new Error(`Invalid Details`);
    }

})

exports.addUserToTeam = asyncHandler(async(req, res) => {
    const { teamname, username } = req.body;
    const teamExists = await Team.findOne({teamname});
    if(teamExists) {
        Team.updateOne({teamname}, {
            $set : {
                userNames : [ ...teamExists.userNames, ...username ]
            }
        }, (err, data)=>{
            if(err){
                res.status(500);
                throw new Error(err);
            }else{
                res.status(200).json({ success: true, message: "Users successfully added to the team."});
            }
        })
    }
})
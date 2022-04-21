const asyncHandler = require('express-async-handler');
const Teamrequests = require('../models/TeamRequest');
const Team = require('../models/Team');

exports.sendTeamRequest = asyncHandler(async(req, res) => {
    const { teamname, username, userId } = req.body
    try{
        if(teamname && username && userId){
            const team = await Team.findOne({teamname});
            if(team){
                if(!team.userNames.includes(username) && !team.userIds.includes(userId.toString())){
                    const request = await Teamrequests.findOne({
                        $and: [{username}, {userId}, {teamname}],
                    })
                    if(request){
                        res.status(400);
                        throw new Error("Pending Request")
                    }else{
                        const newRequest = await Teamrequests.create({teamname, username, userId: userId.toString()});
                        res.status(200).json({success: true, data:newRequest })
                    }
                }else{
                    res.status(400);
                    throw new Error("You are a member of this team already")
                }
            }else{
                res.status(404);
                throw new Error("Team does not exist")
            }
        }else{
            res.status(400);
            throw new Error("Please Input all values")
        }
    }catch(err){
        res.status(400);
        throw new Error(`${err}`)
    }    
});

exports.getAllRequests = asyncHandler(async(req, res) => {
    
    try{
        const request = await Teamrequests.find({});
        res.status(200).json({success: true, data: request})
    }catch(err){
        res.status(400);
        throw new Error(`${err}`)
    }
});

exports.getTeamRequests = asyncHandler(async(req, res) => {
    const { teamname } = req.body
    try{
        const request = await Teamrequests.find({teamname});
        res.status(200).json({success: true, data: request})
    }catch(err){
        res.status(400);
        throw new Error(`${err}`)
    }
});

exports.getMemberRequests = asyncHandler(async(req, res) => {
    const { username, _id } = req.user
    try{
        const request = await Teamrequests.find({
            $and: [{username}, {userId : _id.toString()}],
        })
        res.status(200).json({success: true, data: request})
    }catch(err){
        res.status(400);
        throw new Error(`${err}`)
    }
});
const Team = require('../models/Team');
const Teamrequests = require('../models/TeamRequest');
const asyncHandler = require('express-async-handler');


exports.createTeam = asyncHandler(async(req, res) => {
    req.body.creator = req.user.username;
    const { teamname, creator, statecode, userNames, userIds, teamphoto, coverphoto } = req.body;
    try{
        if(teamname && creator) {
            const teamExists = await Team.findOne({teamname});
            if(teamExists){
                throw new Error(`Team Already Exists`);
            }else{
                try{
                    let team;
                    if(teamphoto && coverphoto){
                        team = await Team.create({teamname, creator, statecode, userNames : [creator, ...userNames], userIds: [req.user._id.toString(), ...userIds], teamphoto, coverphoto});
                    }else{
                        team = await Team.create({teamname, creator, statecode, userNames : [creator, ...userNames], userIds: [req.user._id.toString(), ...userIds] });
                    }
                    if(team){
                        const teamData = {
                            teamId : team._id,
                            teamname : team.teamname,
                            creator: team.teamname,
                            statecode: team.statecode,
                            userNames: team.userNames,
                            teamphoto: team.teamphoto,
                            coverphoto: team.coverphoto
                        }
                        res.status(201).json({success: true, data: teamData});
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
    }catch(err){
        res.status(401);
        throw new Error(`${err}`);
    }
});

exports.getATeam = asyncHandler(async(req, res) => {
    const { teamname } = req.params;
    const loggedInUserName = req.user.username
    try{
        const team = await Team.findOne({teamname});
        const isTeam = team.userNames.includes(loggedInUserName)
        const teamData = {
            teamId : team._id,
            teamname : team.teamname,
            creator : team.creator,
            userNames:team.userNames,
            statecode : team.statecode,
            teamphoto: team.teamphoto,
            coverphoto: team.coverphoto,
            isTeam
        }
        res.status(200).json({success: true, data: teamData})
    }catch(err){
        res.status(401);
        throw new Error(`${err}`);
    }
})

exports.getAllTeams = asyncHandler(async(req, res) => {
    try{
        const teams = await Team.find({});
        const loggedInUserName = req.user.username
        const teamsData = teams.map(team =>{
        const isTeam = team.userNames.includes(loggedInUserName);
            return {
                teamId : team._id,
                teamname : team.teamname,
                creator : team.creator,
                userNames:team.userNames,
                statecode : team.statecode,
                teamphoto: team.teamphoto,
                coverphoto: team.coverphoto,
                isTeam
            }
        })
        res.status(200).json({success: true, data : teamsData})
    }catch(err){
        res.status(401)
        throw new Error(`Invalid Details`);
    }

})

exports.addUserToTeam = asyncHandler(async(req, res) => {
    const { teamname, username, userId } = req.body;
    try{
        const teamExists = await Team.findOne({teamname});
        if(teamExists) {
            if(!teamExists.userNames.includes(username) && !teamExists.userIds.includes(userId.toString())){
                const request = await Teamrequests.findOne({
                    $and: [{username}, {userId: userId.toString()}, {teamname}],
                })
                if(request){
                    await request.delete()
                    Team.updateOne({teamname}, {
                        $set : {
                            userNames : [ ...teamExists.userNames, username ],
                            userIds : [ ...teamExists.userIds, userId.toString() ],
                        }
                    }, (err, data)=>{
                        if(err){
                            res.status(500);
                            throw new Error(err);
                        }else{
                            res.status(200).json({ success: true, message: "User successfully added to the team."});
                        }
                    })
                }else{
                    res.status(404);
                    throw new Error("Request to join the team not found");
                }
            }else{
                res.status(400);
                throw new Error("Already a member of this team");
            }
        }else{
            res.status(404);
            throw new Error("Team Does not exist");
        }
    }catch(err){
        res.status(400);
        throw new Error(`${err}`);
    }
});

exports.leaveTeam = asyncHandler(async(req, res) => {
    const { teamname } = req.body;
    const { username, _id } = req.user;
    try{
        const teamExists = await Team.findOne({teamname});
        if(teamExists) {
            if(teamExists.userNames.includes(username) && teamExists.userIds.includes(_id.toString())){
                await teamExists.updateOne({ $pull: { userNames: username, userIds: _id.toString() } });
                res.status(200).json({success: true, message:"Successfully Left the team"});
            }else{
                res.status(400);
                throw new Error("Not a member of this team");
            }
        }else{
            res.status(404);
            throw new Error("Team Does not exist");
        }
    }catch(err){
        res.status(400);
        throw new Error(`${err}`);
    }
})

exports.removeUser = asyncHandler(async(req, res) => {
    const { teamname, username, userId  } = req.body;
    try{
        const teamExists = await Team.findOne({teamname});
        if(teamExists) {
            if(teamExists.userNames.includes(username) && teamExists.userIds.includes(userId.toString())){
                await teamExists.updateOne({ $pull: { userNames: username, userIds: userId.toString() } });
                res.status(200).json("Successfully Removed User");
            }else{
                res.status(400);
                throw new Error("Not a member of this team");
            }
        }else{
            res.status(404);
            throw new Error("Team Does not exist");
        }
    }catch(err){
        res.status(400);
        throw new Error(`${err}`);
    }
})

exports.getTeamMembers = asyncHandler(async(req, res) => {
    const { teamname } = req.params;
    try{
        const teamExists = await Team.findOne({teamname});
        if(teamExists){
            res.status(200).json({
                success: true,
                data : {
                    userNames: teamExists.userNames,
                    userIds : teamExists.userIds,
                }
            })
        }else{
            res.status(404);
            throw new Error("Team does not exist");
        }
    }catch(err){
        res.status(400);
        throw new Error("Team does not exist");
    }
})

exports.getUserTeams = asyncHandler(async(req, res)=>{
    try{
        const teams = await Team.find({
            userIds: req.user._id.toString()
        })
        const teamsData = teams.map(team =>{
            return {
                teamId : team._id,
                teamname : team.teamname,
                creator : team.creator,
                userNames:team.userNames,
                statecode : team.statecode,
                teamphoto: team.teamphoto,
                coverphoto: team.coverphoto
            }
        })
        res.status(200).json({success: true, data : teamsData})
    }catch(err){
        res.status(400);
        throw new Error(`${err}`)
    }
})
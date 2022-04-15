const Team = require('../models/Team');
const asyncHandler = require('express-async-handler');


exports.createTeam = asyncHandler(async(req, res) => {
    req.body.creator = req.user.username;
    const { teamname, creator, statecode, userNames, userIds, teamphoto, coverphoto } = req.body;
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
});

exports.getATeam = asyncHandler(async(req, res) => {
    const { teamname } = req.params;
    try{
        const team = await Team.findOne({teamname});
        const teamData = {
            teamId : team._id,
            teamname : team.teamname,
            creator : team.creator,
            userNames:team.userNames,
            statecode : team.statecode,
            teamphoto: team.teamphoto,
            coverphoto: team.coverphoto
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
        res.status(401)
        throw new Error(`Invalid Details`);
    }

})

exports.addUserToTeam = asyncHandler(async(req, res) => {
    const { teamname, username, userId } = req.body;
    const teamExists = await Team.findOne({teamname});
    if(teamExists) {
        Team.updateOne({teamname}, {
            $set : {
                userNames : [ ...teamExists.userNames, username ],
                userIds : [ ...teamExists.userIds, userId ],
            }
        }, (err, data)=>{
            if(err){
                res.status(500);
                throw new Error(err);
            }else{
                res.status(200).json({ success: true, message: "User successfully added to the team."});
            }
        })
    }
})

exports.getUserTeams = asyncHandler(async(req, res)=>{
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
})
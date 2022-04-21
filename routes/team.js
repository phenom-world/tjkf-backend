const express = require('express');
const router = express.Router();
const { createTeam, getAllTeams, addUserToTeam, getATeam, getUserTeams, leaveTeam,removeUser, getTeamMembers  } = require('../controllers/team');
const { getMemberRequests, getTeamRequests, getAllRequests, sendTeamRequest  } = require('../controllers/teamrequests');
const {protect, admin} = require('../middlewares/auth')

router.route('/create-team').post(protect, admin, createTeam);
router.route("/getTeams").get(protect, getAllTeams);
router.route("/getTeamMembers/:teamname").get(protect, getTeamMembers);
router.route("/getuserteams").get(protect, getUserTeams);
router.route("/getTeam/:teamname").get(protect, getATeam);
router.route("/addUser").put(protect, admin, addUserToTeam);
router.route("/removeUser").put(protect, admin, removeUser);
router.route("/leaveteam").put(protect, leaveTeam );
router.route("/getTeamRequests").get(protect, admin, getTeamRequests);
router.route("/getAllRequests").get(protect, admin, getAllRequests);
router.route("/getMemberRequests").get(protect, getMemberRequests);
router.route("/sendTeamRequest").post(protect, sendTeamRequest);


module.exports = router;
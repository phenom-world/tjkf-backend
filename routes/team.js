const express = require('express');
const router = express.Router();
const { createTeam, getAllTeams, addUserToTeam, getATeam, getUserTeams } = require('../controllers/team');
const {protect, admin} = require('../middlewares/auth')

router.route('/create-team').post(protect, admin, createTeam);
router.route("/getTeams").get(protect, getAllTeams);
router.route("/getuserteams").get(protect, getUserTeams);
router.route("/getTeam/:teamname").get(protect, getATeam);
router.route("/addUser").put(protect, admin, addUserToTeam);

module.exports = router;
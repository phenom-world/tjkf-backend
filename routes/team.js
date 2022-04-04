const express = require('express');
const router = express.Router();
const { createTeam, getAllTeams, addUserToTeam } = require('../controllers/team');
const {protect, admin} = require('../middlewares/auth')

router.route('/create-team').post(protect, admin, createTeam);
router.route("/getTeams").get(getAllTeams);
router.route("/addUser").put(protect, admin, addUserToTeam);

module.exports = router;
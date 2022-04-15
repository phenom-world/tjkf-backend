const express = require('express');
const router = express.Router();

const { addFriend, acceptRequest, rejectRequest, getMyRequests } = require('../controllers/request');
const {protect, admin} = require('../middlewares/auth');

router.route('/addfriend').post(protect, addFriend);
router.route("/getfriendrequests").get(protect, getMyRequests);
router.route("/acceptfriendrequest").put(protect, acceptRequest);
router.route("/rejectfriendrequest").delete(protect, rejectRequest)

module.exports = router;
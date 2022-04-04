const express = require('express');
const router = express.Router();
const { sendMessage, getMessageByRoom } = require('../controllers/teammessages');
const {protect, admin} = require('../middlewares/auth')

router.route('/send-message/:id').post(protect, sendMessage);
router.route("/getmessages/:id").get(protect, getMessageByRoom);

module.exports = router;
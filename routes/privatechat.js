const express = require('express');
const router = express.Router();
const { sendMessage, receivedMesages, sentMesages, starOrUnstarMessage } = require('../controllers/privatechat');
const {protect, admin} = require('../middlewares/auth');

router.route('/sendmessage').post(protect, sendMessage);
router.route("/receivedmesages").get(protect, receivedMesages);
router.route("/sentmessages").get(protect, sentMesages);
router.route("/starorunstarmessage/:id").put(protect, starOrUnstarMessage);

module.exports = router;
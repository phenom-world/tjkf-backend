const express = require('express');
const {register,login,getMe, updateProfile, updatePassword,logout, verifyUser, resendVerificationLink, forgotPassword, resetPassword} = require('../controllers/user')
const router = express.Router();

const {protect} = require('../middlewares/auth')

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/verify/:token').get(verifyUser);
router.route('/resendVerificationLink').post(resendVerificationLink);
router.route('/me').get(protect , getMe);
router.route('/updatedetails').put(protect , updateProfile);
router.route('/updatepassword').put(protect , updatePassword)
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);

module.exports = router;
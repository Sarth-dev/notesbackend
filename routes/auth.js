const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

router.post('/send-otp', auth.sendOtp);
router.post('/verify-otp', auth.verifyOtp);
router.post('/google-login', auth.googleLogin);

module.exports = router;

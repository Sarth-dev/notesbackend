const User = require('../models/User');
const { createToken } = require('../utils/jwt');
const { sendOTP } = require('../utils/email');
const { generateOTP } = require('../utils/otp');
const { verifyGoogleToken } = require('../utils/google');

exports.sendOtp = async (req, res) => {
  const { email, name, dob } = req.body;
  if (!email || !name || !dob) return res.status(400).json({ error: 'All fields required' });
  const otp = generateOTP();
  let user = await User.findOneAndUpdate(
    { email },
    { name, dob, otp, otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true, new: true }
  );
  await sendOTP(email, otp);
  res.json({ message: 'OTP sent' });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });
  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ error: 'Incorrect or expired OTP' });
  }
  user.otp = null;
  await user.save();
  const token = createToken(user);
  res.json({ token, user: { email: user.email, name: user.name, dob: user.dob } });
};

exports.googleLogin = async (req, res) => {
  const { token: idToken } = req.body;
  const payload = await verifyGoogleToken(idToken);
  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = new User({
      email: payload.email,
      googleId: payload.sub,
      name: payload.name
    });
    await user.save();
  }
  const token = createToken(user);
  res.json({ token, user: { name: user.name, email: user.email } });
};

const jwt = require('jsonwebtoken');
exports.createToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.verifyToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

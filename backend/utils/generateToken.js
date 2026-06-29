const jwt = require('jsonwebtoken');

const generateToken = (userId, rememberMe = false) => {
  const expire = rememberMe ? process.env.JWT_REMEMBER_EXPIRE : process.env.JWT_EXPIRE;
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: expire });
};

const sendTokenResponse = (user, statusCode, res, rememberMe = false) => {
  const token = generateToken(user._id, rememberMe);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (rememberMe ? 30 : parseInt(process.env.JWT_COOKIE_EXPIRE)) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo,
    isVerified: user.isVerified,
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({ success: true, token, data: userData });
};

module.exports = { generateToken, sendTokenResponse };

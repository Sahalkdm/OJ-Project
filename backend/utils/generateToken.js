const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (user) => {
  const payload = {
    id: user?._id,
    email: user?.email,
    isAdmin: user?.isAdmin
  };

  const options = {
    expiresIn: "1h"
  };

  return jwt.sign(payload, process.env.SECRET_KEY, options);
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (user) => {
  const payload = { id: user._id };

  return jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};

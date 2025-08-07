const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    type: user.type // Optional: add user type (e.g., admin, student, etc.)
  };

  const options = {
    expiresIn: "24h"
  };

  return jwt.sign(payload, process.env.SECRET_KEY, options);
};

module.exports = generateToken;

const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies
    // const token = req.cookies?.token;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No user found"
      });
    }

    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(401).json({ success: false, message: "Invalid token" });
      req.user = user;
      next();
    });

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;

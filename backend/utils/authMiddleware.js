const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No user found"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find user from payload
    // const user = await User.findById(decoded.id).select("-password");

    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Invalid token. User not found."
    //   });
    // }

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;

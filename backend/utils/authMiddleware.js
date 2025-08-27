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
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

const authMiddlewareOptional1 = async (req, res, next) => {
  try {
    // Get token from cookies
    // const token = req.cookies?.token;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let exist_user = null;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No user found"
      });
    }

    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(401).json({ success: false, message: "Invalid token" });
      exist_user = user
    });

    req.user = exist_user;
    next();
  } catch (error) {
    req.user = null;
    next();
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

const authMiddlewareOptional = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // If no token → allow request to continue without attaching user
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        // Invalid token → ignore and continue as guest
        req.user = null;
        return next();
      }
      req.user = user; // Attach user info if valid
      next();
    });

  } catch (error) {
    // Continue as guest in case of unexpected error
    req.user = null;
    return next();
  }
};


module.exports = {
  authMiddleware,
  authMiddlewareOptional
};

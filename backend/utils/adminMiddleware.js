

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Access denied. User not found." });
    }
    if (!req.user?.isAdmin) {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Error verifying as admin." })
  }
  
};

module.exports = adminMiddleware;
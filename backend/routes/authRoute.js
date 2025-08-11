const { Signup, Login, Logout, UserVerification } = require("../controllers/authController");
const authMiddleware = require("../utils/authMiddleware");

const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/verify", authMiddleware, UserVerification);

module.exports = router;
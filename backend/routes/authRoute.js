const { Signup, Login, Logout, UserVerification } = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/verify", UserVerification);

module.exports = router;
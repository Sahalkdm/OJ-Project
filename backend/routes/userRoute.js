const { GetLeaderboard } = require("../controllers/userController");
const authMiddleware = require("../utils/authMiddleware");

const router = require("express").Router();

router.get("/leaderboard", authMiddleware, GetLeaderboard);

module.exports = router;
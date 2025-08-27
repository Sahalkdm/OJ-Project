const { GetLeaderboard, GetDashBoard, GetAllUsers, GetAllSubmissions, GetSubmissionUser, GetSubmissionUserProblem, getAdminDashboardStats } = require("../controllers/userController");
const adminMiddleware = require("../utils/adminMiddleware");
const { authMiddleware } = require("../utils/authMiddleware");

const router = require("express").Router();

router.get("/leaderboard", authMiddleware, GetLeaderboard);
router.get("/dashboard", authMiddleware, GetDashBoard); 
router.get("/get-all", authMiddleware, adminMiddleware, GetAllUsers);
router.get("/submissions", authMiddleware, adminMiddleware, GetAllSubmissions);
router.get("/submissions-user", authMiddleware, GetSubmissionUser);
router.get("/submissions-user-problem/:problem_id", authMiddleware, GetSubmissionUserProblem);
router.get("/admin-dashboard", authMiddleware, adminMiddleware, getAdminDashboardStats);

module.exports = router;
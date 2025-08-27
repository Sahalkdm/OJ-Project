const { createContest, deleteContest, getAllContests, getContestById, getLatestContest, mapProblemsToContest, registerForContest, submitContestCode, updateContest, updateProblemMapping, deleteProblemMapping, getContestProblems, startContest, exitContest, autoSubmitPendingUsers, registerUserForContest, getContestRegistrations, getUserProblemSubmissions, getContestSubmissions, getLeaderboard, getContestUserProblemScores } = require("../controllers/ContestController");
const adminMiddleware = require("../utils/adminMiddleware");
const { authMiddleware, authMiddlewareOptional } = require("../utils/authMiddleware");

const router = require("express").Router();

router.post("/", authMiddleware, adminMiddleware, createContest);
router.put("/:id", authMiddleware, adminMiddleware, updateContest);
router.delete("/:id", authMiddleware, adminMiddleware, deleteContest);
router.get("/", authMiddlewareOptional, getAllContests);
router.get("/get/:id", authMiddleware, getContestById);
router.get("/latest", authMiddlewareOptional, getLatestContest);

router.post("/map-to-problems", authMiddleware, adminMiddleware, mapProblemsToContest);
router.put("/map-to-problems/:contestId/:problemId", authMiddleware, adminMiddleware, updateProblemMapping);
router.delete("/map-to-problems/:contestId/:problemId", authMiddleware, adminMiddleware, deleteProblemMapping);
router.get("/:contestId/problems", authMiddleware, getContestProblems);

router.get("/start/:contestId", authMiddleware, startContest);
router.get("/user-status/:contestId", authMiddleware, startContest);
router.get("/register/:contestId", authMiddleware, registerForContest);
router.post("/submit", authMiddleware, submitContestCode);
router.get("/:contestId/exit", authMiddleware, exitContest);
router.get("/:contestId/close-all", authMiddleware, adminMiddleware, autoSubmitPendingUsers);

router.get("/:contestId/register/:email", authMiddleware, adminMiddleware, registerUserForContest);
router.get("/:contestId/submissions", authMiddleware, adminMiddleware, getContestSubmissions);
router.get("/:contestId/get-registrations", authMiddleware, adminMiddleware, getContestRegistrations);
router.get("/:contestId/problem-submissions/:problemId", authMiddleware, getUserProblemSubmissions);
router.get("/:contestId/leaderboard", authMiddleware, getLeaderboard);
router.get("/:contestId/contest-scores", authMiddleware, adminMiddleware, getContestUserProblemScores);

module.exports = router;
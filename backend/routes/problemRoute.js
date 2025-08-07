const { createProblem, GetAllProblems, GetProblemById } = require("../controllers/problemController");
const authMiddleware = require("../utils/authMiddleware");

const router = require("express").Router();

router.post("/create", authMiddleware, createProblem);
router.get("/get-all", GetAllProblems);
router.get("/:id",authMiddleware ,GetProblemById);

module.exports = router;
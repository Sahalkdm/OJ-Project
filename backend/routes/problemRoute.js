const { 
    createProblem, 
    GetAllProblems, 
    GetProblemById, 
    CreateTestCases, 
    getTestCasesByProblem, 
    updateTestcase, 
    deleteTestCase,
    GetLeaderboard,
    updateProblem,
    deleteProblem,
} = require("../controllers/problemController");
const adminMiddleware = require("../utils/adminMiddleware");

const authMiddleware = require("../utils/authMiddleware");

const router = require("express").Router();

router.post("/create", authMiddleware, adminMiddleware, createProblem);  // create problem
router.get("/get-all", GetAllProblems); // get all problems
router.get("/:id",authMiddleware ,GetProblemById); // get a perticular problem details
router.put('/update/:id', authMiddleware, adminMiddleware, updateProblem) // Update problem
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteProblem) // Delete problem

router.post("/:problemId/create-test-cases", authMiddleware, adminMiddleware, CreateTestCases); // create test cases for a problem
router.get("/:problemId/get-all-test-cases", authMiddleware, adminMiddleware, getTestCasesByProblem); // get all test cases for a problem
router.put("/update-test-case/:id", authMiddleware, adminMiddleware, updateTestcase); // update a test case
router.delete("/delete-test-case/:id", authMiddleware,adminMiddleware,  deleteTestCase); // delete a testcase

module.exports = router;
const { 
    createProblem, 
    GetAllProblems, 
    GetProblemById, 
    CreateTestCases, 
    getTestCasesByProblem, 
    updateTestcase, 
    deleteTestCase,
    updateProblem,
    deleteProblem,
    AddTags,
    GetTags,
} = require("../controllers/problemController");

const adminMiddleware = require("../utils/adminMiddleware");
const { authMiddleware, authMiddlewareOptional } = require("../utils/authMiddleware");

const router = require("express").Router();

router.post('/add-tag', authMiddleware, adminMiddleware, AddTags); // Add tags
router.get('/tags', GetTags); // Get all tags

router.post("/create", authMiddleware, adminMiddleware, createProblem);  // create problem
router.get("/get-all", authMiddlewareOptional, GetAllProblems); // get all problems
router.get("/:id",authMiddleware ,GetProblemById); // get a perticular problem details
router.put('/update/:id', authMiddleware, adminMiddleware, updateProblem) // Update problem
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteProblem) // Delete problem

router.post("/:problemId/create-test-cases", authMiddleware, adminMiddleware, CreateTestCases); // create test cases for a problem
router.get("/:problemId/get-all-test-cases", authMiddleware, adminMiddleware, getTestCasesByProblem); // get all test cases for a problem
router.put("/update-test-case/:id", authMiddleware, adminMiddleware, updateTestcase); // update a test case
router.delete("/delete-test-case/:id", authMiddleware,adminMiddleware,  deleteTestCase); // delete a testcase

module.exports = router;
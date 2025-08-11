
const { RunTestCode, RunCustomTestCode, SubmitCode } = require("../controllers/codeRunController");
const authMiddleware = require("../utils/authMiddleware");

const router = require("express").Router();

router.post("/test-cases", authMiddleware, RunTestCode); // run sample test cases
router.post("/custom-test-case", authMiddleware, RunCustomTestCode); // run custom test cases
router.post("/submit-code", authMiddleware, SubmitCode); // run custom test cases

module.exports = router;
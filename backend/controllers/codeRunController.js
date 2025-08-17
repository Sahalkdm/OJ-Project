const Problem = require("../model/Problem");
const Submission = require("../model/Submission");
const TestCase = require("../model/TestCase");
const UserProblemScore = require("../model/UserProblemScore");
const { runCodeOnCompiler } = require("../utils/codeRunner");
const evaluateSubmission = require("../utils/evaluateSubmission");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require('dotenv');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports.RunTestCode = async (req, res) => {
  try {
    const { code, language, testCases } = req.body;

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ success: false, message: "No test cases provided", output: [] });
    }

    const results = [];
    for (let i = 0; i < testCases.length; i++) {
      const { input = "", output: expectedOutput = "" } = testCases[i];

      const runResult = await runCodeOnCompiler({ code, language, input, timeout: 4000 });

      const passed = runResult.success && runResult.output === expectedOutput.trim()
      const testStatus = runResult?.success ? (passed ? "OK" : "WA") : runResult?.status

      results.push({
        testCase: i + 1,
        input,
        expectedOutput,
        actualOutput: runResult.output,
        passed: passed,
        error: runResult.error,
        status: testStatus // OK, CE, RTE, TLE
      });
    }

    res.status(201).json({
      success: true,
      message: "Test cases executed successfully",
      output: results,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Internal server error", output: [] });
  }
};

module.exports.RunCustomTestCode = async (req, res) => {
  try {
    const { code, language, testcase = "" } = req.body;
    console.log(testcase)

    const runResult = await runCodeOnCompiler({ code, language, input:testcase, timeout: 4000 });
    console.log(runResult)
    res.status(201).json({
      success: true,
      message: "Test cases executed successfully",
      output: runResult?.output,
      error: runResult?.error,
      status:runResult?.status
    });
  } catch (err) {
    console.error("Error running test cases:", err);
    res.status(500).json({ success: false, message: err?.message || "Internal server error", output: '', error: err?.message || "Internal server error", });
  }
};

module.exports.SubmitCode = async (req, res) => {
  try {
    const user = req.user
    const { code, language, problemId } = req.body;

    const testCases = await TestCase.find({ problemId });

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ success: false, message: "No test cases found for this problem", output: [] });
    }

    //let passedCount = 0;
    const results = [];
    for (let i = 0; i < testCases.length; i++) {
      const { input = "", output: expectedOutput = "", hidden } = testCases[i];

      const runResult = await runCodeOnCompiler({ code, language, input, timeout: 4000 });

      const passed = runResult.success && runResult.output === expectedOutput.trim();
      const testStatus = runResult?.success ? (passed ? "OK" : "WA") : runResult?.status
      //if (passed) passedCount++;

      results.push({
        testCase: i + 1,
        hidden,
        input: hidden ? undefined : input,
        expectedOutput:hidden ? undefined : expectedOutput,
        actualOutput: hidden ? undefined : runResult.output,
        passed: passed,
        error: hidden ? undefined : runResult.error,
        status: hidden ? undefined : testStatus // OK, WA, CE, RTE, TLE
      });
    }

    // const totalCount = testCases.length;
    // const score = Math.round((passedCount / totalCount) * 100);

    const { score, status, verdict } = evaluateSubmission(results);

    // Save submission in DB
    await Submission.create({ user_id: user?.id, problem_id: problemId, code, score, language, status, verdict });

    // Find current best for this problem
    const existing = await UserProblemScore.findOne({ user_id:user?.id, problem_id:problemId });
    if (!existing) {
      // First submission → insert record and update leaderboard
      await UserProblemScore.create({ user_id:user?.id, problem_id:problemId, best_score: score });
      
    } else if (score > existing.best_score) {
      // New best score → update problem score and leaderboard total
      await UserProblemScore.updateOne(
        { user_id:user?.id, problem_id:problemId },
        { $set: { best_score: score } }
      );
    }

    res.status(201).json({
      success: true,
      message: "Test cases executed successfully",
      output: results,
      score,
    });
  } catch (err) {
    console.error("Error running test cases:", err);
    res.status(500).json({ success: false, message: err?.message || "Internal server error", output: [] });
  }
};

module.exports.GetReview = async (req, res) => {
  const {language, code} = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze the following code in ${language}, and provide a short and concise review of the code. 
      Also, provide a list of potential improvements and suggestions for the code. **Do not provide solution**.
      Code: ${code}`,
    });
     res.status(201).json({
      success:true,
      message:"Code Reviewed Successfully!",
      review:response?.text
     })
  } catch (error) {
    res.status(500).json({
      success:true,
      message:"Error generating review!",
     })
  }
}
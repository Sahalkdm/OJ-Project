
const Contest = require("../model/contest/Contest");
const ContestProblem = require("../model/contest/ContestProblem");
const ContestScoreboard = require("../model/contest/ContestScoreboard");
const ContestSubmission = require("../model/contest/ContestSubmission");
const ContestUser = require("../model/contest/ContestUser");
const Problem = require("../model/Problem");
const TestCase = require("../model/TestCase");
const User = require("../model/User");
const { runCodeOnCompiler } = require("../utils/codeRunner");
const evaluateSubmission = require("../utils/evaluateSubmission");
const { mongoose } = require("mongoose");

module.exports.createContest = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      duration,
      isPublic, // true/false
      rules
    } = req.body;

    const user = req.user;

    // ✅ Validate required fields
    if (!(title && startTime && endTime)) {
      return res.status(400).json({
        success: false,
        message: "Title, start time, and end time are required"
      });
    }

    // ✅ Ensure start time < end time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time"
      });
    }

    // ✅ Check if contest with same title already exists
    const existingContest = await Contest.findOne({ title: title.trim() });
    if (existingContest) {
      return res.status(409).json({
        success: false,
        message: "A contest with this title already exists"
      });
    }

    // ✅ Create the contest
    const contest = await Contest.create({
      title: title.trim(),
      description: description?.trim() || "",
      start_time: new Date(startTime),
      end_time: new Date(endTime),
      duration: duration,
      isPublic: isPublic ? true : false,
      rules: rules?.trim() || "",
      created_by: user?.id
    });

    return res.status(201).json({
      success: true,
      message: "Contest created successfully!",
      contest: {
        _id: contest._id,
        title: contest.title,
        startTime: contest.start_time,
        endTime: contest.end_time,
      }
    });
  } catch (error) {

    // ✅ Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

module.exports.updateContest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      startTime,
      endTime,
      duration,
      isPublic, // true/false
      rules
    } = req.body;

    const user = req.user;

    // ✅ Validate required fields
    if (!(title && startTime && endTime)) {
      return res.status(400).json({
        success: false,
        message: "Title, start time, and end time are required"
      });
    }

    // ✅ Ensure start time < end time
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time"
      });
    }

    // Find contest by id
    const contest = await Contest.findById(id);
    if (!contest) {
        return res.status(404).json({
        success: false,
        message: "Problem not found"
        });
    }

    // ✅ Check if contest with same title already exists
    const existingContest = await Contest.findOne({ title: title.trim(), _id: { $ne: id }  });
    if (existingContest) {
      return res.status(409).json({
        success: false,
        message: "A contest with this title already exists"
      });
    }

    contest.title = title.trim();
    contest.description = description.trim();
    contest.rules = rules.trim();
    contest.duration = duration;
    contest.isPublic = isPublic ? true : false;
    contest.start_time = startTime;
    contest.end_time = endTime;


    await contest.save();

    return res.status(201).json({
      success: true,
      message: "Contest updated successfully!",
      contest: {
        _id: contest._id,
        title: contest.title,
        startTime: contest.start_time,
        endTime: contest.end_time,
      }
    });
  } catch (error) {

    // ✅ Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// ✅ Delete Contest
module.exports.deleteContest = async (req, res) => {
  try {
    const { id } = req.params;

    const contest = await Contest.findByIdAndDelete(id);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    return res.status(200).json({ success: true, message: "Contest deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Couldn't perform deletion, Server error" });
  }
};

// ✅ Get All Contests
module.exports.getAllContests = async (req, res) => {
  const user = req.user;
  let contests
  try {
    if (user?.isAdmin){
      contests = await Contest.find().sort({ start_time: 1 }); // upcoming first
    }else{
      contests = await Contest.find({isPublic:true}).sort({ start_time: 1 }).select("title description start_time end_time duration rules");
    }
    
    return res.status(200).json({ success: true, contests });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Contest by ID
module.exports.getContestById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid contest ID" });
    }

    let contest;
    if (user?.isAdmin){
      contest = await Contest.findById(id).select("title description start_time end_time duration rules isPublic").lean();
    }else{
      contest = await Contest.findById(id).select("title description start_time end_time duration rules").lean();
    }

    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    return res.status(200).json({ success: true, contest, message: "Contest fetched successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get the latest contest
module.exports.getLatestContest = async (req, res) => {
  try {
    const user = req.user; // if using auth middleware
    // Fetch the latest contest with required fields only
    const latestContest = await Contest.findOne({ end_time: { $gte: new Date() } })
      .sort({ start_time: -1 }) // newest first
      .select("title description start_time end_time duration rules") // only needed fields
      .lean();

    if (!latestContest) {
      return res.status(200).json({ success: false, message: "No upcoming contests!" });
    }

    let isRegistered = false;

    if (user) {
      const registration = await ContestUser.findOne({
        contest_id: latestContest._id,
        user_id: user?.id,
      }).lean();

      if (registration) {
        isRegistered = true;
      }
    }

    return res.status(200).json({
      success: true,
      contest: {
        ...latestContest,
        isRegistered,
      },
      message: "Contest loaded successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Server Error!",
    });
  }
};

// Map one or multiple problems to a contest
module.exports.mapProblemsToContest = async (req, res) => {
  try {
    const { contestId, questions } = req.body;
    // problems should be array of objects: [{ problemId, maxScore }, ...]

    if (!contestId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // ✅ Check contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    // ✅ Validate problems exist
    const problemIds = questions.map((p) => p.questionId);
    const foundProblems = await Problem.find({ _id: { $in: problemIds } });
    if (foundProblems.length !== problemIds.length) {
      return res.status(400).json({ success: false, message: "Some problems not found" });
    }

    // ✅ Create mappings (ignore duplicates due to unique index)
    const mappings = questions.map((p) => ({
      contest_id: contestId,
      problem_id: p.questionId,
      max_score: p.maxScore || 100,
    }));

    // insertMany with ordered:false → continues even if duplicates
    const result = await ContestProblem.insertMany(mappings, { ordered: false });

    return res.status(200).json({
      success: true,
      message: "Problems mapped to contest successfully",
      data: result,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Some problems were already mapped to this contest",
      });
    }

    return res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update mapping
module.exports.updateProblemMapping = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;
    const { maxScore } = req.body;

    const updated = await ContestProblem.findOneAndUpdate(
      { contest_id: contestId, problem_id: problemId },
      { $set: { max_score: maxScore } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Mapping not found" });
    }

    res.json({ success: true, message: "Mapping updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// DELETE mapping
module.exports.deleteProblemMapping = async (req, res) => {
  try {
    const { contestId, problemId } = req.params;

    const deleted = await ContestProblem.findOneAndDelete({
      contest_id: contestId,
      problem_id: problemId,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Mapping not found" });
    }

    res.json({ success: true, message: "Problem removed from contest" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// GET /contests/:contestId/problems
module.exports.getContestProblems = async (req, res) => {
  try {
    const user = req.user;
    const { contestId } = req.params;

    // ✅ Check contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    // ✅ Security check: if normal user, block before startTime - 5 mins
    const now = new Date();
    const allowTime = new Date(contest.start_time.getTime() - 60 * 1000); // 1 mins before start

    if (!user?.isAdmin && now < allowTime) {
      return res.status(403).json({
        success: false,
        message: "Problems not available before contest start",
      });
    }

    // ✅ Lookup problems mapped to this contest
    const mappings = await ContestProblem.find({ contest_id: contestId })
      .populate("problem_id", "title") // fetch problem details
      .lean();

    // ✅ Collect problemIds
    const problemIds = mappings.map(m => m.problem_id._id);

    // ✅ Fetch user statuses for these problems efficiently
    const userScores = await ContestScoreboard.find({
      contest_id: contestId,   // leverage compound index
      user_id: user?.id,
      problem_id: { $in: problemIds },
    })
      .select("problem_id best_score") // no need for unnecessary fields
      .lean();

    // const statusMap = {};
    // userScores.forEach(s => {
    //   statusMap[s.problem_id.toString()] = {
    //     score: s.best_score
    //   };
    // });
    
    // Map for quick lookup
    const scoreMap = {};
    userScores?.forEach(s => {
      scoreMap[s.problem_id.toString()] = s.best_score;
    });

    // ✅ Final response
    const problemsWithStatus = mappings.map(m => {
      const bestScore = scoreMap[m.problem_id._id.toString()] ?? -1; // -1 means no submission
      let status = "Not Visited";

      if (bestScore >= 0 && bestScore < m.max_score) {
        status = "Attempted";
      } else if (bestScore === m.max_score) {
        status = "Accepted";
      }

      return {
        problemId: m.problem_id._id,
        title: m.problem_id.title,
        maxScore: m.max_score,
        bestScore,
        status,
      };
    });

    // Format response
    // const problems = mappings.map(m => ({
    //   problemId: m.problem_id._id,
    //   title: m.problem_id.title,
    //   maxScore: m.max_score,
    //   score: statusMap[m.problem_id._id.toString()]?.score || 0,
    // }));

    res.json({
      success: true,
      contest: {
        id: contest._id,
        name: contest.name,
        description: contest.description,
        startTime:contest.start_time,
        problems:problemsWithStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

module.exports.registerForContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user?.id; // assuming from JWT auth middleware

    // Find contest
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    // Check if registration is allowed
    if (new Date() > contest.start_time) {
      return res.status(400).json({ success: false, message: "Registration closed. Contest already started." });
    }

    // Create registration
    const contestUser = await ContestUser.create({
      contest_id: contestId,
      user_id: userId,
      status: "Registered",
    });

    res.status(201).json({ success: true, message: "Registered successfully", data: contestUser });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key (already registered)
      return res.status(400).json({ success: false, message: "Already registered for this contest" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Start a contest attempt
module.exports.startContest = async (req, res) => {
  try {
    const user = req.user; // Auth middleware must set req.user
    const { contestId } = req.params;

    // Fetch contest
    const contest = await Contest.findById(contestId)
      .select("start_time end_time")
      .lean();

    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    const now = new Date();

    // Validate contest timing
    if (now < new Date(contest.start_time)) {
      return res.status(200).json({ success: false, message: "Contest has not started yet" });
    }

    if (now > new Date(contest.end_time)) {
      return res.status(200).json({ success: false, message: "Contest has already ended" });
    }

    // Check if user has already started the contest
    let attempt = await ContestUser.findOne({
      contest_id: contest._id,
      user_id: user.id,
    });

    if (attempt) {
      // If already started, just return existing start time
      if (attempt.status === "Started"){
        return res.status(200).json({
          success: true,
          message: "Contest already started",
          joinTime: attempt.join_time,
          status: attempt.status,
        });
      }else if (attempt.status === "Registered"){
        attempt.status = "Started";
        attempt.join_time = now;
        await attempt.save(); 
      }
    }else{
      return res.status(200).json({ success: false, message: "Not registered for this contest!" });
    }

    return res.status(200).json({
      success: true,
      message: "Contest started successfully",
      joinTime: attempt.join_time,
      status: attempt.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error. Please try refresh the page.",
    });
  }
};

exports.getContestUserStatus = async (req, res) => {
  try {
    const { contestId } = req.params;
    const userId = req.user.id; // from JWT auth middleware

    // Find the record of this user in contestUser table
    let contestUser = await ContestUser.findOne({ contest_id:contestId, user_id:userId });

    if (!contestUser) {
      return res.status(200).json({ success: false, message: "User has not joined this contest" });
    }

    return res.status(200).json({
      success: true,
      joinTime: contestUser.join_time,
      status: contestUser.status,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error, try again later"
    });
  }
};

module.exports.submitContestCode = async (req, res) => {
  try {
    const user = req.user;
    const { code, language, problemId, contestId } = req.body;

    // 1. Verify contest
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    const now = new Date();
    if (now < contest.start_time || now > contest.end_time) {
      return res.status(200).json({ success: false, message: "Contest is not active" });
    }

    // 2. Ensure user registered
    const registered = await ContestUser.findOne({ contest_id: contestId, user_id: user.id });
    if (!registered || registered.status !== "Started") {
      return res.status(403).json({ success: false, message: "You are not allowed to submit for this contest" });
    }

    // User-specific duration check
    const userEndTime = new Date(registered.join_time.getTime() + contest.duration * 60 * 1000); 
    // duration assumed in minutes

    if (now > userEndTime) {
      return res.status(200).json({ success: false, message: "Your contest time is over" });
    }

    // 3. Fetch problem test cases
    const testCases = await TestCase.find({ problemId });
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({ success: false, message: "No test cases found for this problem", output: [] });
    }

    const results = [];
    const startAll = Date.now();

    for (let i = 0; i < testCases.length; i++) {
      const { input = "", output: expectedOutput = "", hidden } = testCases[i];

      const runResult = await runCodeOnCompiler({ code, language, input, timeout: 4000 });
      const passed = runResult.success && runResult.output === expectedOutput.trim();
      const testStatus = runResult?.success ? (passed ? "OK" : "WA") : runResult?.status;

      results.push({
        testCase: i + 1,
        hidden,
        input: hidden ? undefined : input,
        expectedOutput: hidden ? undefined : expectedOutput,
        actualOutput: hidden ? undefined : runResult.output,
        passed,
        error: hidden ? undefined : runResult.error,
        status: testStatus,
      });
    }

    const endAll = Date.now();
    const totalExecutionTime = (endAll - startAll);

    const { score, status, verdict } = evaluateSubmission(results);

    // 4. Save in ContestSubmission
    const submission = await ContestSubmission.create({
      contest_id: contestId,
      problem_id: problemId,
      user_id: user.id,
      code,
      language,
      verdict,
      status,
      score,
      execution_time: totalExecutionTime,
    });

    // 5. Update ContestScoreboard (best score only)
    const existing = await ContestScoreboard.findOne({ contest_id: contestId, user_id: user.id, problem_id: problemId });
    const max_score_obj = await ContestProblem.findOne({ contest_id: contestId, problem_id: problemId }, { max_score: 1, _id: 0 }).lean();
    const max_score = max_score_obj?.max_score;
    const best_score = score*max_score/100;
    if (!existing) {
      await ContestScoreboard.create({
        contest_id: contestId,
        user_id: user.id,
        problem_id: problemId,
        best_score: best_score,
      });
    } else if (best_score > existing.best_score) {
      await ContestScoreboard.updateOne(
        { contest_id: contestId, user_id: user.id, problem_id: problemId },
        {
          $set: { best_score: best_score },
          // $inc: { penalty_time: status === "OK" ? 0 : 20 * 60 }, // optional penalty logic
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Submission evaluated",
      output: results,
      score,
      verdict,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

module.exports.exitContest = async (req, res) => {
  try {
    const { contestId } = req.params;  // from route
    const userId = req.user.id;       // assuming you use authMiddleware

    if (!contestId) {
      return res.status(400).json({ success: false, message: "Some thing went wrong!" });
    }

    // find the contest-user record
    const contestUser = await ContestUser.findOne({ contest_id:contestId, user_id:userId });
    if (!contestUser) {
      return res.status(200).json({ success: false, message: "User not registered" });
    }

    // Prevent multiple exits/updates
    if (contestUser.status === "Completed") {
      return res.status(200).json({ 
        success: true, 
        message: `Contest already ${contestUser.status}` 
      });
    }

    contestUser.status = "Completed";
    contestUser.submission_time = new Date();

    await contestUser.save();

    return res.status(200).json({
      success: true,
      message: "Contest exited successfully",
      data: {
        contestId,
        userId,
        status: contestUser.status,
        submissionTime: contestUser.submission_time,
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.autoSubmitPendingUsers = async (req, res) => {
  try {
    const { contestId } = req.params;
    const now = new Date();

    await Contest.findByIdAndUpdate(contestId, {isClosed:true});

    const pendingUsers = await ContestUser.find({
      contest_id:contestId,
      status: { $ne: "Completed" },
      join_time: { $ne: null },
    });

    if (!pendingUsers.length) {
      return res.json({ success: true, message: "No pending users" });
    }

    const bulkOps = pendingUsers.map(user => ({
      updateOne: {
        filter: { 
          user_id: user.user_id,
          contest_id: user.contest_id
         },
        update: {
          $set: {
            status: "Completed",
            submission_time: now,
          },
        },
      },
    }));

    await ContestUser.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: `Auto-submitted ${pendingUsers.length} users`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.getLeaderboard = async (req, res) => {
  const limit = 100; // default top 20
  try {
    const { contestId } = req.params;

    const leaderboard = await ContestScoreboard.aggregate([
      {
        $match: { contest_id: new mongoose.Types.ObjectId(contestId) }
      },
      {
        $group: {
          _id: "$user_id",
          totalScore: { $sum: "$best_score" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user_id: "$_id",
          name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
          totalScore: 1
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: limit }
    ]);

    return res.status(200).json({ success: true, leaderboard, message: "Leaderboard fetched successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard"
    });
  }
};

module.exports.getContestSubmissions = async (req, res) => {
  try {
    const { contestId } = req.params;

    const submissions = await ContestSubmission.aggregate([
      { $match: { contest_id: new mongoose.Types.ObjectId(contestId) } },

      // Join with users
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },

      // Join with problems
      {
        $lookup: {
          from: "problems",
          localField: "problem_id",
          foreignField: "_id",
          as: "problem"
        }
      },
      { $unwind: "$problem" },

      {
        $project: {
          _id: 1,
          name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
          email: "$user.email",
          user_id: "$user._id",
          problem_title: "$problem.title",
          problem_id: "$problem._id",
          language: 1,
          code: 1,
          status: 1,
          score: 1,
          createdAt: 1
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all submissions of a user for a problem in a contest
module.exports.getUserProblemSubmissions = async (req, res) => {
  try {
    const { contestId, problemId } = req.params; 
    const userId = req.user.id; // from auth middleware

    // Fetch all submissions for this user, contest, and problem
    const submissions = await ContestSubmission.find({
      contest_id: contestId,
      problem_id: problemId,
      user_id: userId,
    })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports.getContestRegistrations = async (req, res) => {
  try {
    const { contestId } = req.params;

    if (!contestId) {
      return res.status(400).json({ success: false, message: "No contest found" });
    }

    const registrations = await ContestUser.aggregate([
      {
        $match: { contest_id: new mongoose.Types.ObjectId(contestId) }
      },
      {
        $lookup: {
          from: "users", // collection name in DB
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          user_id: 1,
          contest_id: 1,
          join_time: 1,
          status:1,
          name: { $concat: ["$user.firstname", " ", "$user.lastname"] },
          email: "$user.email",
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching contest registrations" });
  }
};

module.exports.registerUserForContest = async (req, res) => {
  try {
    const { contestId, email } = req.params;

    if (!contestId || !email) {
      return res.status(400).json({ success: false, message: "contestId and email are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find contest by ID
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: "Contest not found" });
    }

    // Check if user is already registered
    const alreadyRegistered = ContestUser.findOne({contest_id:contestId, user_id:user?._id});
    if (alreadyRegistered) {
      return res.status(200).json({ success: false, message: "User is already registered for this contest" });
    }

    await ContestUser.create({contest_id:contestId, user_id:user._id, status:"Registered"});

    return res.status(200).json({ success: true, message: `User ${email} registered successfully for the contest` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.getContestUserProblemScores = async (req, res) => {
  try {
    const { contestId } = req.params;

    const scores = await ContestScoreboard.find({contest_id:contestId});

    res.status(200).json({
      success: true,
      data: scores,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, Server error!",
    });
  }
};

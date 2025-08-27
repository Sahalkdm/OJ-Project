const { default: mongoose } = require("mongoose");
const Submission = require("../model/Submission");
const UserProblemScore = require("../model/UserProblemScore");
const User = require("../model/User");
const Problem = require("../model/Problem");

/**
 * Get Leaderboard
 * Aggregates total score per user from the UserProblemScore table
 * Returns top N users sorted by score
 */
module.exports.GetLeaderboard = async (req, res) => {
  const limit = 50; // default top 20
  try {
    const leaderboard = await UserProblemScore.aggregate([
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

    res.status(201).json({
      success: true,
      message: "Leaderboard fetched successfully",
      leaderboard
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard"
    });
  }
};

module.exports.GetDashBoard = async (req, res) => {
  const user = req.user
  try {
    const submissions = await Submission.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(user.id) } // uses index on user_id
      },
      {
        $lookup: {
          from: 'problems', // collection name in MongoDB
          localField: 'problem_id',
          foreignField: '_id',
          as: 'problemData'
        }
      },
      {
        $unwind: '$problemData'
      },
      {
        $project: {
          _id: 1,
          status: 1,
          score:1,
          language:1,
          submitted_at: 1,
          difficulty: '$problemData.difficulty'
        }
      }
    ]);
    const userProblemsBest = await UserProblemScore.find({user_id:user?.id});

    if (submissions?.length === 0 || userProblemsBest === 0){
      return res.status(404).json({
        success: false,
        message: "No data found"
      })
    }

    res.status(201).json({
      success:true,
      message: "Dashboard data fetched successfully!",
      submissions: submissions || [],
      userProblemsScore: userProblemsBest || [],
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message: "Error loading data"
    })
  }
}

module.exports.GetAllUsers = async (req, res) => {

  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const query = search
      ? { firstname: { $regex: search, $options: "i" } }
      : {};

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(201).json({
      success:true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message: "Error loading Users"
    })
  }
} 

module.exports.GetAllSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const submissions = await Submission.aggregate([
      // Sort newest first (optional)
      { $sort: { submitted_at: -1 } },
      // Pagination
      { $skip: (page - 1) * limit },
      { $limit: limit },
      // Lookup from Problems collection
      {
        $lookup: {
          from: "problems", // collection name in MongoDB (lowercase + plural by default)
          localField: "problem_id",
          foreignField: "_id",
          as: "problem"
        }
      },
      { $unwind: "$problem" },

      // Lookup from Users collection
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },

      // Project only needed fields
      {
        $project: {
          _id: 1,
          status: 1,
          submitted_at: 1,
          score: 1,
          language: 1,
          "problem.title": 1,
          "problem.difficulty": 1,
          "user.firstname": 1,
          "user.lastname": 1
        }
      },
    ]);

    // Count total submissions
    const total = await Submission.countDocuments();

    res.status(200).json({
      success: true,
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalSubmissions: total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error loading submissions"
    });
  }
};

module.exports.GetSubmissionUser = async (req, res) => {
  const user = req.user;
  try {
    const submissions = await Submission.find({user_id:user?.id}).sort({ submitted_at: -1 }).lean();
    res.status(200).json({
      success:true,
      submissions:submissions || [],
      message:"Submissions loaded successfully!"
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Error loading submissions!"
    })
  }
}

module.exports.GetSubmissionUserProblem = async (req, res) => {
  const user = req.user;
  const {problem_id} = req.params
  try {
    const submissions = await Submission.find({user_id:user?.id, problem_id:problem_id}).sort({ submitted_at: -1 }).lean();
    res.status(200).json({
      success:true,
      submissions:submissions || [],
      message:"Submissions loaded successfully!"
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Error loading submissions!"
    })
  }
}

// Controller to get Admin Dashboard stats
module.exports.getAdminDashboardStats = async (req, res) => {
  try {
    /**
     * 1. Submissions Trend (group by date)
     */
    const submissionsTrend = await Submission.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$submitted_at" },
          },
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "OK"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          total: 1,
          accepted: 1,
          _id: 0,
        },
      },
    ]);

    /**
     * 2. Language Distribution
     */
    const languageUsage = await Submission.aggregate([
      {
        $group: {
          _id: "$language",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
      { $sort: { value: -1 } },
    ]);

    /**
     * 3. Difficulty wise submissions (Accepted + Wrong)
     */
    const difficultyWise = await Submission.aggregate([
      // Lookup problems to fetch difficulty
      {
        $lookup: {
          from: "problems",
          localField: "problem_id",
          foreignField: "_id",
          as: "problem",
        },
      },
      { $unwind: "$problem" },
      {
        $group: {
          _id: "$problem.difficulty",
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "OK"] }, 1, 0] },
          },
          wrong: {
            $sum: { $cond: [{ $ne: ["$status", "OK"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          difficulty: "$_id",
          accepted: 1,
          wrong: 1,
          _id: 0,
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    const acceptedSubmissions = await Submission.countDocuments({ score: 100 });

    return res.status(200).json({
      success: true,
      submissionsTrendData: submissionsTrend,
      languageData: languageUsage,
      difficultyData: difficultyWise,
      totalProblems,
      totalSubmissions,
      totalUsers,
      acceptedSubmissions,
      message: "Dashboard stats loaded successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error loading dashboard stats",
    });
  }
};
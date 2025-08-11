const UserProblemScore = require("../model/UserProblemScore");

/**
 * Get Leaderboard
 * Aggregates total score per user from the UserProblemScore table
 * Returns top N users sorted by score
 */
module.exports.GetLeaderboard = async (req, res) => {
  const limit = 20; // default top 20
    console.log(limit)
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
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching leaderboard"
    });
  }
};
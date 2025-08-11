const mongoose = require("mongoose");

/**
 * UserProblemScore Schema
 * Stores the best score a user has achieved for a given problem
 * Used for leaderboard and performance optimization
 */
const userProblemScoreSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true // Index for fast lookups by user
  },
  problem_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
    index: true // Index for fast lookups by problem
  },
  best_score: {
    type: Number,
    required: true,
    min: [0, "Score cannot be negative"],
    max: [100, "Score cannot exceed 100"]
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Compound index to ensure one entry per (user, problem)
userProblemScoreSchema.index({ user_id: 1, problem_id: 1 }, { unique: true });

// Export the model
module.exports = mongoose.model("UserProblemScore", userProblemScoreSchema);

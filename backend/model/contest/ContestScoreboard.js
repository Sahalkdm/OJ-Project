const mongoose = require("mongoose");

const contestScoreboardSchema = new mongoose.Schema(
  {
    contest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    best_score: {
      type: Number,
      default: 0,
    },
    penalty_time: {
      type: Number,
      default: 0, // For ACM/ICPC style
    },
  },
  { timestamps: true }
);

contestScoreboardSchema.index({ contest_id: 1, user_id: 1 });

module.exports =  mongoose.model("ContestScoreboard", contestScoreboardSchema);

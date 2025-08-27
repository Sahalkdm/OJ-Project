const mongoose = require("mongoose");

const contestProblemSchema = new mongoose.Schema(
  {
    contest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    problem_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    max_score: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

// Ensure same problem not added twice in one contest
contestProblemSchema.index({ contest_id: 1, problem_id: 1 }, { unique: true });

module.exports =  mongoose.model("ContestProblem", contestProblemSchema);

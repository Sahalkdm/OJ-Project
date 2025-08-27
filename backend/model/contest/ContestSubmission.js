const mongoose = require("mongoose");

const contestSubmissionSchema = new mongoose.Schema(
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
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String, // stored in Mongo or GridFS/S3 if large
      required: true,
    },
    language: {
      type: String,
      enum: ["cpp", "py", "java"],
      required: true,
    },
    verdict: {
        type: String,
    },
    status: {
      type: String,
      enum: [
        "OK", // Accepted
        "WA", // Wrong Answer
        "TLE", // Time Limit Exceeded
        "MLE", // Memory Limit
        "RE", // Runtime Error
        "CE", // Compilation Error
        "NA", //Not attempted
      ],
      default: "NA",
    },
    score: {
      type: Number,
      default: 0,
    },
    execution_time: {
      type: Number, // in ms
    },
  },
  { timestamps: true }
);

contestSubmissionSchema.index({ contest_id: 1, user_id: 1, problem_id: 1 });
contestSubmissionSchema.index({ user_id: 1, createdAt: -1 });

module.exports = mongoose.model("ContestSubmission", contestSubmissionSchema);

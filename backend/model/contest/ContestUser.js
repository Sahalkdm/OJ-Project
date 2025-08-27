const mongoose = require("mongoose");

const contestUserSchema = new mongoose.Schema(
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
    join_time: {
      type: Date,
      default: Date.now,
    },
    submission_time: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Registered", "Started", "Completed"],
      default: "Registered", // registered/started/completed
    },
  },
  { timestamps: true }
);

contestUserSchema.index({ contest_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("ContestUser", contestUserSchema);

const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    rules: {
      type: String,
    },
    start_time: {
      type: Date,
      required: [true, "Start time is required"],
      index:true,
    },
    end_time: {
      type: Date,
      required: [true, "End time is required"],
    },
    duration: {
      type: Number, // in minutes
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

contestSchema.index({ title: 1 });

module.exports =  mongoose.model("Contest", contestSchema);

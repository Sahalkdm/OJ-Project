const mongoose = require("mongoose");

/**
 * Submission Schema Definition
 * Defines the structure for submission documents in MongoDB
 * Includes validation and constraints for submission data
 */
const submissionSchema = new mongoose.Schema({
    // Reference to the user who made the submission
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        index: true // Index for fast lookups by user
    },

    // Reference to the problem being solved
    problem_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: [true, "Problem ID is required"],
        index: true // Index for fast lookups by problem
    },

    // Programming language used for the submission
    language: {
        type: String,
        required: [true, "Programming language is required"],
        trim: true,
        maxlength: [30, "Language name cannot exceed 30 characters"]
    },

    // Source code submitted by the user
    code: {
        type: String,
    },

    /**
     * Status of the submission
     * Possible values: "OK", "CE" (Compilation Error), "RTE" (Runtime Error), "TLE" (Time Limit Exceeded), "WA" (Wrong Answer)
     */
    status: {
        type: String,
        required: [true, "Status is required"],
        enum: ["OK", "CE", "RTE", "TLE", "WA"],
    },

    // Score awarded for the submission (0 - 100)
    score: {
        type: Number,
        required: [true, "Score is required"],
        min: [0, "Score cannot be less than 0"],
        max: [100, "Score cannot exceed 100"]
    },

    // Additional verdict/message from the judge
    verdict: {
        type: String,
        trim: true,
        maxlength: [200, "Verdict message cannot exceed 200 characters"]
    },

    // Date and time when submission was made
    submitted_at: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

/**
 * Compound indexes for common queries
 * - (user_id, problem_id): Fetch a user's submission history for a specific problem
 */
submissionSchema.index({ user_id: 1, problem_id: 1 });

// Create and export the Submission model based on the schema
module.exports = mongoose.model("Submission", submissionSchema);

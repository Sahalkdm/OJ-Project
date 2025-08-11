const mongoose = require("mongoose");

/**
 * Problem Schema Definition
 * Defines the structure for problem documents in MongoDB
 * Includes validation and constraints for all problem fields
 */
const problemSchema = new mongoose.Schema({
  // Problem title
  title: {
    type: String,
    required: [true, "Problem title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"],
    index:true,
  },

  // Detailed problem description
  statement: {
    type: String,
    required: [true, "Problem statement is required"],
    trim: true,
    minlength: [10, "Statement must be at least 10 characters long"]
  },

  // Difficulty level (Easy, Medium, Hard)
  difficulty: {
    type: String,
    required: [true, "Difficulty level is required"],
    enum: {
      values: ["Easy", "Medium", "Hard"],
      message: "Difficulty must be either Easy, Medium, or Hard"
    }
  },

  // Array of sample inputs and outputs
  examples: {
    type: [
        {
        input: { type: String, required: [true, "Sample input is required"] },
        output: { type: String, required: [true, "Sample output is required"] },
        explanation: { type: String, default: "" }
        }
    ]
    },

  // Constraints on input/output ranges or formats
  constraints: {
    type: String,
    trim: true,
    default: ""
  },

  // Explanation of input format
  input_format: {
    type: String,
    trim: true,
    default: ""
  },

  // Explanation of output format
  output_format: {
    type: String,
    trim: true,
    default: ""
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references the User model
    required: true,
  },
  
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // references the User model
  },

}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create and export the Problem model based on the schema
module.exports = mongoose.model("Problem", problemSchema);

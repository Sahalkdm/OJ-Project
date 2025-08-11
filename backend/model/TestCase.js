const mongoose = require("mongoose");

/**
 * TestCase Schema Definition
 * Each test case is linked to a problem and includes input/output strings.
 */
const testCaseSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },

  input: {
    type: String,
    required: [true, "Test case input is required"],
  },

  output: {
    type: String,
    required: [true, "Test case output is required"],
  },

  hidden: {
    type: Boolean,
    default: true, // Hidden by default
  },

});

// ✅ Add index on `problem`
testCaseSchema.index({ problemId: 1 });

module.exports = mongoose.model("TestCase", testCaseSchema);

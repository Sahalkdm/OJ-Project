const Problem = require("../model/Problem");
const TestCase = require("../model/TestCase");
const UserProblemScore = require("../model/UserProblemScore");

module.exports.createProblem = async (req, res, next) => {
  try {
    const {
      title,
      statement,
      difficulty,
      examples,
      constraints,
      input_format,
      output_format
    } = req.body;

    const user = req.user;

    // Check for required fields
    if (!(title && statement && difficulty && Array.isArray(examples))) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Optional: check if a problem with the same title already exists
    const existingProblem = await Problem.findOne({ title: title.trim() });
    if (existingProblem) {
      return res.status(409).json({
        success: false,
        message: "A problem with this title already exists"
      });
    }

    // Create the problem
    const problem = await Problem.create({
      title: title.trim(),
      statement: statement.trim(),
      difficulty,
      examples,
      constraints: constraints?.trim() || "",
      input_format: input_format?.trim() || "",
      output_format: output_format?.trim() || "",
      createdBy:user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Problem created successfully!",
      problem: {
        _id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        createdAt: problem.createdAt
      }
    });
  } catch (error) {
    console.error("Problem creation error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during problem creation"
    });
  }
};

module.exports.updateProblem = async (req, res, next) => {
  try {
    const { id } = req.params; // problem ID from URL
    const {
      title,
      statement,
      difficulty,
      examples,
      constraints,
      input_format,
      output_format
    } = req.body;

    // Validate required fields
    if (!(title && statement && difficulty && Array.isArray(examples))) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Find problem by id
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    // Optional: check if another problem with the same title exists (excluding this problem)
    const existingProblem = await Problem.findOne({ title: title.trim(), _id: { $ne: id } });
    if (existingProblem) {
      return res.status(409).json({
        success: false,
        message: "A problem with this title already exists"
      });
    }

    // Update problem fields
    problem.title = title.trim();
    problem.statement = statement.trim();
    problem.difficulty = difficulty;
    problem.examples = examples;
    problem.constraints = constraints?.trim() || "";
    problem.input_format = input_format?.trim() || "";
    problem.output_format = output_format?.trim() || "";

    await problem.save();

    res.status(201).json({
      success: true,
      message: "Problem updated successfully!",
      problem: {
        _id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        updatedAt: problem.updatedAt
      }
    });
  } catch (error) {
    console.error("Problem update error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during problem update"
    });
  }
};


module.exports.deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find problem by id
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    await problem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully!"
    });
  } catch (error) {
    console.error("Problem deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during problem deletion"
    });
  }
};

module.exports.GetAllProblems = async (req, res) => {
  try {

    const problems = await Problem.find({}, { title: 1, difficulty: 1, _id: 1 }); // _id is included by default;

    res.status(200).json({
      success:true,
      message:"Fetched all questions",
      problems: problems || []
    })

  } catch (error) {
    res.status(500).json({
      success:false,
      message:"Error fetching problems"
    })
  }
}

module.exports.GetProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }
    res.status(200).json({ success: true, message:"Question Loaded", problem });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching problem" });
  }
};

module.exports.CreateTestCases = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { testCases } = req.body; // Expecting an array of test cases

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({success:false,  message: "Problem not found" });
    }

    // Validate testCases
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({success:false, message: "Provide atleast one test case" });
    }

    // Attach problemId to each test case
    const formattedTestCases = testCases.map(tc => ({
      ...tc,
      problemId
    }));

    // Insert all test cases in one go
    const inserted = await TestCase.insertMany(formattedTestCases);

    res.status(201).json({
      success:true,
      message: "Test cases added successfully",
      count: inserted.length,
      testCases: inserted,
    });
  } catch (err) {
    console.error("Error adding test cases:", err);
    res.status(500).json({success:false, message: "Internal server error" });
  }
}

// GET /api/testcases/:problemId
module.exports.getTestCasesByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const testcases = await TestCase.find({ problemId });
    res.status(201).json({success:true, testcases: testcases || [], message:"Test cases fetched successfully"});
  } catch (err) {
    res.status(500).json({success:false,  message: "Internel Server Error" });
  }
};

// Update a testcase
module.exports.updateTestcase = async (req, res) => {
  try {
    const { id } = req.params;
    const { input, output, hidden } = req.body;
    const updated = await TestCase.findByIdAndUpdate(
      id,
      { input, output, hidden },
      { new: true }
    );

    if (!updated) return res.status(404).json({success:false, message: 'Testcase not found' });

    res.status(200).json({success:true, message: 'Testcase updated', updatedTestCase: updated });
  } catch (err) {
    res.status(500).json({success:false, message: 'Error updating testcase', error: err.message });
  }
};

// Delete a testcase
module.exports.deleteTestCase = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await TestCase.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({success:false, message: 'Testcase not found' });

    res.status(200).json({success:true, message: 'Testcase deleted', deleted: deleted });
  } catch (err) {
    res.status(500).json({success:false, message: 'Error deleting testcase', error: err.message });
  }
};





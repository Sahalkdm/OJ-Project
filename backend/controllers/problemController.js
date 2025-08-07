const Problem = require("../model/Problem");

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

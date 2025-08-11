const axios = require("axios");

const COMPILER_URL = process.env.COMPILER_URL || "http://localhost:8000/run/code";

/**
 * Executes code on the compiler service and returns standardized results.
 *
 * @param {string} code - Source code to compile and execute.
 * @param {string} language - Programming language (cpp, python, java, etc.).
 * @param {string} input - Standard input for the program.
 * @param {number} timeout - Max execution time in ms (default: 2000 ms).
 * @returns {Promise<{ success: boolean, output: string|null, error: string|null, status: string }>}
*/
async function runCodeOnCompiler({ code, language, input = "", timeout = 4000 }) {
  if (!code || typeof code !== "string" || code.trim() === "") {
    return { success: false, output: null, error: "Code cannot be empty", status: "CE" }; // Compilation Error placeholder
  }

  try {
    const response = await axios.post(
      COMPILER_URL,
      { code, language, input },
      { timeout }
    );

    return {
      success: true,
      output: (response.data.output || "").trim(),
      error: null,
      status: "OK", // Passed execution
    };
  } catch (err) {
    let errorMessage = "Unknown error";
    let status = "RTE"; // Runtime Error default

    if (err.code === "ECONNABORTED") {
      errorMessage = "Time Limit Exceeded";
      status = "TLE";
    } else if (err.response?.data?.errorMessage) {
      errorMessage = err.response.data.errorMessage;
      status = "CE"; // Compilation Error from compiler service
    } else if (err.message) {
      errorMessage = err.message;
    }

    return { success: false, output: null, error: errorMessage, status };
  }
}

module.exports = { runCodeOnCompiler };

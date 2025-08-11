// utils/evaluateSubmission.js

/**
 * Evaluate a set of test case results and return score, status, and verdict
 * @param {Array} results - Array of test case result objects
 * @returns {{score: number, status: string, verdict: string}}
 */
function evaluateSubmission(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return { score: 0, status: "IE", verdict: "Internal Error" };
  }

  // Verdict priority mapping
  const priority = {
    CE: 1, // Compilation Error
    RTE: 2, // Runtime Error
    TLE: 3, // Time Limit Exceeded
    WA: 4,  // Wrong Answer
    OK: 5   // Accepted
  };

  let passedCount = 0;
  let worstStatus = "OK";

  results.forEach(tc => {
    if (tc.passed) passedCount++;
    if (tc.status && priority[tc.status] < priority[worstStatus]) {
      worstStatus = tc.status;
    }
  });

  const score = Math.round((passedCount / results.length) * 100);

  // Map status to a human-friendly verdict
  const verdictMap = {
    OK: "Accepted",
    WA: "Wrong Answer",
    CE: "Compilation Error",
    RTE: "Runtime Error",
    TLE: "Time Limit Exceeded",
    IE: "Internal Error"
  };

  return {
    score,
    status: worstStatus,
    verdict: verdictMap[worstStatus] || "Unknown"
  };
}

module.exports = evaluateSubmission;

import { useState, useEffect } from "react";

export default function SubmissionResults({ results, score }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (results && results.length > 0) {
      const firstFailIndex = results.findIndex((tc) => !tc.passed);
      if (firstFailIndex !== -1) {
        setExpandedIndex(firstFailIndex);
      }
    }
  }, [results]);

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="mt-4 mb-8 bg-gray-50 border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Submission Results
        </h2>
        <span className="text-green-600 font-semibold">
          Score: {score}%
        </span>
      </div>

      <div className="mt-4 divide-y">
        {results?.length > 0 && results?.map((tc, idx) => {
          const isExpanded = expandedIndex === idx;
          const isHidden = tc.hidden;

          return (
            <div
              key={idx}
              className={`p-3 cursor-pointer transition-colors ${
                tc.passed
                  ? "bg-green-50 hover:bg-green-100"
                  : "bg-red-50 hover:bg-red-100"
              }`}
              onClick={() => toggleExpand(idx)}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {isHidden ? "Hidden Test Case" : `Test Case ${tc.testCase}`}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    tc.passed
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {tc.passed ? "Passed" : "Failed"}
                </span>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-2 text-sm space-y-2">
                  {isHidden ? (
                    <p className="italic text-gray-600">
                      Input/Output hidden for this test case.
                    </p>
                  ) : (
                    <>
                      <pre className="whitespace-pre-wrap">
                        <strong>Input:</strong> {tc.input}
                      </pre>
                      <pre className="whitespace-pre-wrap">
                        <strong>Expected:</strong> {tc.expectedOutput}
                      </pre>
                      <pre className="whitespace-pre-wrap">
                        <strong>Actual:</strong> {tc.actualOutput}
                      </pre>
                    </>
                  )}
                  {tc.error && (
                    <pre className="whitespace-pre-wrap text-red-600">
                      <strong>Error:</strong> {tc.error}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

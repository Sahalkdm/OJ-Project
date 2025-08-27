import React from "react";
import { Link } from "react-router-dom";

const QuestionTable = ({ questions, contestId, canNavigate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-center rounded-lg">
        <thead className="bg-gray-200 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 border-b dark:border-gray-700">Title</th>
            <th className="px-4 py-3 border-b dark:border-gray-700">Score</th>
            <th className="px-4 py-3 border-b dark:border-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr
              key={q.problemId}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <td className="px-4 py-3 border-b dark:border-gray-700 font-medium">{canNavigate ? <Link to={`/contest/${contestId}/problem/${q.problemId}`}>{q.title}</Link> : <p>{q.title}</p>}</td>
              <td className="px-4 py-3 border-b dark:border-gray-700 font-medium">{q.maxScore}</td>
              <td className="px-4 py-3 border-b dark:border-gray-700">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    q.status === "Accepted"
                      ? "bg-green-600 text-white"
                      : q.status === "Attempted"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {q.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;

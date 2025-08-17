import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { GetSubmissionsUserProblem } from '../../api/problemApi';

function SubmissionTable({ setCode, setLanguage, problem_id }) {

    const [submissions, setSubmissions] = useState([]);
    useEffect(()=>{
            const fetchSubmissions = async () =>{
                try {
                    const res = await GetSubmissionsUserProblem(problem_id);
                    if (res?.success){
                        setSubmissions(res?.submissions)
                    }else{
                        handleError(res?.message || "Error loading problem")
                    }
                } catch (error) {
                    handleError(error?.message || "Error loading problem")
                }
            }
    
            fetchSubmissions();
        }, [problem_id,])

    const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
    });
  return (
    <div>
      {/* Submissions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr className="text-left text-gray-700 dark:text-gray-300">
                  <th className="px-4 py-2 border-b dark:border-gray-700">Date</th>
                  <th className="px-4 py-2 border-b dark:border-gray-700">Verdict</th>
                  <th className="px-4 py-2 border-b dark:border-gray-700">Status</th>
                  <th className="px-4 py-2 border-b dark:border-gray-700">Language</th>
                  <th className="px-4 py-2 border-b dark:border-gray-700">Score</th>
                  <th className="px-4 py-2 border-b dark:border-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions?.length > 0 ? (
                  submissions.map((sub, idx) => (
                    <tr
                      key={idx}
                      className="text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                      <td className="px-4 py-2 border-b dark:border-gray-700">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>
                      <td
                        className={`px-4 py-2 border-b dark:border-gray-700 font-medium ${
                          sub.verdict === "Accepted"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {sub.verdict}
                      </td>
                      <td className="px-4 py-2 border-b dark:border-gray-700">
                        {sub.status}
                      </td>
                      <td className="px-4 py-2 border-b dark:border-gray-700">
                        {sub.language}
                      </td>
                      <td className="px-4 py-2 border-b dark:border-gray-700">
                        {sub.score}
                      </td>
                      <td className="px-4 py-2 border-b dark:border-gray-700">
                        <button
                          onClick={() => {setCode(sub.code);setLanguage(sub.language)}}
                          className="px-3 py-1 text-sm rounded bg-cyan-600 text-white hover:bg-cyan-500"
                        >
                          Load
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
    </div>
  )
}

export default SubmissionTable

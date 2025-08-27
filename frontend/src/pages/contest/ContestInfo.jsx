import React from 'react'
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function ContestInfo() {
    const { contestData, fetchSectionData } = useOutletContext();

  useEffect(() => {
    if (!contestData.info) {
      fetchSectionData("info");
    }
  }, [contestData.info, fetchSectionData]);

  if (!contestData.info) {
    return <div className="flex justify-center items-center h-40">Loading...</div>;
  }
  const { title, description, start_time, end_time, rules, duration, isPublic } = contestData.info;
  return (
    <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
        {title}
      </h2>

      <p className="mt-3 text-gray-600 dark:text-gray-300 text-center">{description}</p>

      <div className="mt-4 text-sm text-gray-700 dark:text-gray-400 space-y-1 text-center">
        <p>
          <span className="font-medium">Start:</span>{" "}
          {new Date(start_time).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">End:</span>{" "}
          {new Date(end_time).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Duration:</span> {duration} mins
        </p>
        <p>
          <span className="font-medium">Visibility:</span>{" "}
          {isPublic ? "Public" : "Private"}
        </p>
      </div>

      {rules && rules.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Rules
          </h3>
          <ReactMarkdown>
            {rules}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default ContestInfo

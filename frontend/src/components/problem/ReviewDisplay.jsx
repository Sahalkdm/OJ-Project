import React from "react";
import ReactMarkdown from 'react-markdown';

const CodeReviewDisplay = ({ reviewData }) => {

  return (
    <div className="bg-green-50 dark:bg-green-900 p-4 rounded text-gray-800 dark:text-gray-200">
      <ReactMarkdown>{reviewData}</ReactMarkdown>
    </div>
  );
};

export default CodeReviewDisplay;

// LoadingPage.jsx
import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingPage;
import React from "react";

const TextArea = ({
  label,
  value,
  setValue,
  rows = 4,
  cols = 50,
  className = "",
  placeholder = "",
}) => {
  return (
    <div className="flex flex-col gap-1 mb-4 w-full">
      <label className="font-semibold text-gray-800 dark:text-gray-200">
        {label}
      </label>
      <textarea
        className={`resize-none border border-gray-300 dark:border-gray-700 rounded-md p-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 ${className}`}
        rows={rows}
        cols={cols}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>

  );
};

export default TextArea;

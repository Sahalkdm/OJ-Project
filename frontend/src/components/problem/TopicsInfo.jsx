import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BsInfoCircle } from "react-icons/bs";

export default function TopicsInfo() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // tags with name, short_name, description from redux
  const topics = useSelector((state) => state.tags.list); 

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="relative inline-block">
      {/* Info Icon */}
      <button
        onClick={() => setOpen(true)}
        className="text-gray-600 hover:text-blue-600"
        title="View topic descriptions"
      >
        <BsInfoCircle className="dark:text-gray-200 w-4 h-4"/>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-4 relative dark:bg-gray-800 dark:text-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-center">Topics Info</h2>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>

            {/* List */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => toggleExpand(idx)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium dark:font-normal text-gray-800 dark:text-gray-100">
                      {topic.short_name || topic.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {expanded === idx ? "▲" : "▼"}
                    </span>
                  </div>
                  {expanded === idx && (
                    <p className="text-sm text-gray-600 mt-1 dark:text-gray-100 dark:font-light">
                      {topic.description || "No description available"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

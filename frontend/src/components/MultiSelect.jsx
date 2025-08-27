import React, { useState } from "react";

const MultiSelect = ({ options, selected, setSelected }) => {
  const [query, setQuery] = useState("");

  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(query.toLowerCase()) &&
      !selected.includes(opt)
  );

  const handleSelect = (option) => {
    setSelected([...selected, option]);
    setQuery("");
  };

  const handleRemove = (option) => {
    setSelected(selected.filter((item) => item !== option));
  };

  return (
    <div className="w-full mx-auto">
      <div
        className="flex flex-wrap items-center gap-2 p-2 border rounded-lg 
                   bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
      >
        {selected.map((tag, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 px-3 py-1 text-sm rounded-full 
                       bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-300"
              onClick={() => handleRemove(tag)}
            >
              ✕
            </button>
          </span>
        ))}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selected.length === 0 ? "Select tags..." : "add tags..."}
          className="flex-grow p-1 bg-transparent border-none focus:ring-0
                     text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
        />
      </div>

      {query && filteredOptions.length > 0 && (
        <ul
          className="mt-1 max-h-40 overflow-auto rounded-lg shadow-md border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800"
        >
          {filteredOptions.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className="px-3 py-2 cursor-pointer text-gray-800 dark:text-gray-100 
                         hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
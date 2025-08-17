import { useState } from "react";

const languages = [
  {key: "py", value:"Python"},
  {key: "java", value:"Java"},
  {key: "cpp", value:"C++"},
];

export default function LanguageDropdown({selected, setSelected}) {
  const [open, setOpen] = useState(false);

  const selectedLanguage = languages.find((lang) => lang.key === selected)?.value;

  return (
    <div className="w-48">
      {/* Dropdown button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white dark:bg-gray-700 dark:text-white border border-gray-300 rounded-md shadow-sm px-4 py-1 text-left focus:outline-none flex justify-between items-center hover:shadow hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        {selectedLanguage || "Select a language"}
        <svg
          className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {languages.map((lang) => (
            <li
              key={lang.key}
              onClick={() => {
                setSelected(lang.key);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-slate-500 hover:text-white cursor-pointer"
            >
              {lang.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

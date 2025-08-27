import React from "react";
import { Editor } from "@monaco-editor/react";
import { IoCloseSharp } from "react-icons/io5";

export default function CodeModal({ isOpen, onClose, code, language = "cpp" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[90%] max-w-4xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Submission Code</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <IoCloseSharp className="h-5 w-5" />
          </button>
        </div>

        {/* Monaco Editor */}
        <div className="h-[70vh] p-2">
          <Editor
            height="100%"
            defaultLanguage={language === 'py' ? 'python' : language}
            value={code}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
            }}
          />
        </div>
      </div>
    </div>
  );
}

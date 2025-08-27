import React from 'react'
import ReactMarkdown from 'react-markdown';
import TopicsInfo from './TopicsInfo';

function ProblemDescription({problem}) {
  return (
    <div>
      {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {problem.title}
            </h1>
      
            {/* Difficulty */}
            <div
              className="
                text-sm mt-2 font-medium px-3 py-1 inline-block rounded-full
                bg-blue-100 text-blue-800 
                dark:bg-blue-900 dark:text-blue-200
              "
            >
              {problem.difficulty}
            </div>
          </div>
      
          {/* Description */}
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            <ReactMarkdown>{problem.statement}</ReactMarkdown>
          </div>
      
          {/* Input/Output Format */}
          {problem.input_format && (
            <div>
              <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">
                Input Format
              </h2>
              <pre
                className="
                  bg-gray-100 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap
                  dark:bg-gray-800 dark:text-gray-200
                "
              >
                <ReactMarkdown>{problem.input_format}</ReactMarkdown>
              </pre>
            </div>
          )}
          {problem.output_format && (
            <div>
              <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">
                Output Format
              </h2>
              <pre
                className="
                  bg-gray-100 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap
                  dark:bg-gray-800 dark:text-gray-200
                "
              >
                {problem.output_format}
              </pre>
            </div>
          )}
      
          {/* Constraints */}
          {problem.constraints && (
            <div>
              <h2 className="text-lg font-semibold mt-4 text-gray-800 dark:text-gray-100">
                Constraints
              </h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                {problem.constraints.split("\n").map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
      {problem.tags && problem.tags.length > 0 && (
        <div>
          <h2 className="text-lg flex gap-2 items-center font-semibold mt-4 text-gray-800 dark:text-gray-100">
            Topics <TopicsInfo/>
          </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {problem.tags.map((tag, index) => (
            <span
              key={index}
              className="
                px-3 py-1 text-xs font-medium rounded-full
                bg-green-100 text-green-800
                dark:bg-green-900 dark:text-green-200
              "
            >
              {tag}
            </span>
          ))}
          </div>
        </div>
        )}
      
          {/* Examples */}
          {problem.examples?.map((ex, idx) => (
            <div key={idx} className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Example {idx + 1}
              </h2>
              <div className="mt-2 text-sm">
                <p>
                  <strong className='dark:text-gray-50'>Input:</strong>
                </p>
                <pre
                  className="
                    bg-gray-100 rounded p-3 text-gray-700 whitespace-pre-wrap
                    dark:bg-gray-800 dark:text-gray-200
                  "
                >
                  {ex.input}
                </pre>
      
                <p className="mt-2">
                  <strong className='dark:text-gray-50'>Output:</strong>
                </p>
                <pre
                  className="
                    bg-gray-100 rounded p-3 text-gray-700 whitespace-pre-wrap
                    dark:bg-gray-800 dark:text-gray-200
                  "
                >
                  {ex.output}
                </pre>
      
                {ex.explanation && (
                  <>
                    <p className="mt-2">
                      <strong className='dark:text-gray-50'>Explanation:</strong>
                    </p>
                    <pre
                      className="
                        bg-gray-100 rounded p-3 text-gray-700 whitespace-pre-wrap
                        dark:bg-gray-800 dark:text-gray-200
                      "
                    >
                      {ex.explanation}
                    </pre>
                  </>
                )}
              </div>
            </div>
          ))}
    </div>
  )
}

export default ProblemDescription

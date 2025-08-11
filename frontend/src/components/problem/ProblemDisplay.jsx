import { useEffect } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { GetProblemById, RunCustomTestCase, RunTestCases, SubmitCode } from '../../api/problemApi';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CustomResizeHandle } from '../PanelResizeHandler';
import Editor from '@monaco-editor/react';
import TextArea from '../TextArea';
import SubmissionResults from './SubmissionResult';

export default function ProblemDisplay() {

    const { problem_id } = useParams();

    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState(`#include <iostream> // Required for input/output operations

int main() {
    // Declare two integer variables to store the input numbers
    int num1, num2; 

    std::cin >> num1 >> num2; 

    int sum = num1 + num2; 

    // Display the sum
    std::cout << sum << std::endl; 

    return 0; // Indicate successful program execution
}`);
    const [customInput, setCustomInput] = useState("");
    const [output, setOutput] = useState([]);
    const [submissionResult, setSubmissionResult] = useState([]);
    const [score, setScore] = useState('');
    const [customOutput, setCustomOutput] = useState(null);
    const [runError, setRunError] = useState("");
    const [activeTab, setActiveTab] = useState("run");
    
    useEffect(()=>{
        const fetchProblem = async () =>{
            try {
                const res = await GetProblemById(problem_id);
                if (res?.success){
                    setProblem(res?.problem)
                }else{
                    handleError(res?.message || "Error loading problem")
                }
            } catch (error) {
                handleError(error?.message || "Error loading problem")
            }
        }

        fetchProblem();
    }, [])
    
    const handleError = (err) =>
    toast.error(err, {
        position: "bottom-left",
    });

    const handleSuccess = (msg) =>
      toast.success(msg, {
          position: "bottom-right",
    });

    const runCode = async () => {
    // API call to backend runner
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: customInput }),
    });
    const data = await res.json();
    setOutput(data.output);
  };

      const handleRunCodeCustom = async () => {
        try {
            const res = await RunCustomTestCase('cpp', code, customInput);
            const { success, message, output, error } = res;
            console.log(res);
            setCustomOutput(res);
            if (success){
              handleSuccess(message);
            }else{
              handleError(message);
            }
        } catch (error) {
            console.log(error);
            handleError(error?.message || "Error running the code");
        }
    }

    const handleRunCode = async () => {
        try {
            const res = await RunTestCases('cpp', code, problem?.examples);
            const { success, message, output } = res;
            console.log(res);
            if (success){
              handleSuccess(message);
              setOutput(output);
            }else{
              handleError(message);
            }
        } catch (error) {
            console.log(error);
            setRunError(error?.output || "Error");
            setOutput(error?.output);
            handleError(error?.message || "Error running the code");
        }
    }

    const handleSubmitCode = async () => {
        try {
            const res = await SubmitCode('cpp', code, problem?._id);
            const { success, message, output, score } = res;
            console.log(res);
            if (success){
              handleSuccess(message);
              setSubmissionResult(output);
              setScore(score)
            }else{
              handleError(message);
            }
        } catch (error) {
            console.log(error);
            setRunError(error?.output || "Error");
            setOutput(error?.output);
            handleError(error?.message || "Error running the code");
        }
    }

    if (!problem){
        return <div>Problem Not Loaded</div>
    }

  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={50} minSize={30} order={1}>
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          {/* Title */}
          <div className="">
            <h1 className="text-2xl font-bold text-gray-800">{problem.title}</h1>

            {/* Difficulty */}
            <div className="text-sm mt-2 font-medium px-3 py-1 inline-block rounded-full bg-blue-100 text-blue-800">
                {problem.difficulty}
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {problem.statement}
          </div>

          {/* Input/Output Format */}
          {problem.input_format && (
            <div>
              <h2 className="text-lg font-semibold mt-4 text-gray-800">Input Format</h2>
              <pre className="bg-gray-100 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap">
                {problem.input_format}
              </pre>
            </div>
          )}
          {problem.output_format && (
            <div>
              <h2 className="text-lg font-semibold mt-4 text-gray-800">Output Format</h2>
              <pre className="bg-gray-100 rounded p-3 text-sm text-gray-700 whitespace-pre-wrap">
                {problem.output_format}
              </pre>
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && (
            <div>
              <h2 className="text-lg font-semibold mt-4 text-gray-800">Constraints</h2>
              <ul className="list-disc list-inside text-gray-700 text-sm">
                {problem.constraints.split('\n').map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Examples */}
          {problem.examples?.map((ex, idx) => (
            <div key={idx} className="mt-6">
              <h2 className="text-lg font-semibold text-gray-800">Example {idx + 1}</h2>
              <div className="mt-2 text-sm">
                <p><strong>Input:</strong></p>
                <pre className="bg-gray-100 rounded p-3 text-gray-700 whitespace-pre-wrap">{ex.input}</pre>

                <p className="mt-2"><strong>Output:</strong></p>
                <pre className="bg-gray-100 rounded p-3 text-gray-700 whitespace-pre-wrap">{ex.output}</pre>

                {ex.explanation && (
                  <>
                    <p className="mt-2"><strong>Explanation:</strong></p>
                    <pre className="bg-gray-100 rounded p-3 text-gray-700 whitespace-pre-wrap">{ex.explanation}</pre>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <CustomResizeHandle/>
      {/* <PanelResizeHandle className="w-2 bg-gray-300 cursor-col-resize" /> */}
      <Panel minSize={30} order={2}>
        <div className="p-4 h-full"> 
          <PanelGroup direction='vertical'>
            <Panel defaultSize={60} minSize={30} order={1}>
              {/* Code editor */} 
              <div className='rounded-md h-full mb-2'>
                <Editor 
                  value={code} 
                  onChange={(val)=>setCode(val)}
                  theme="vs-dark"
                  defaultLanguage='cpp'
                  language='cpp'
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    scrollBeyondLastLine: true,
                    automaticLayout: true,
                    lineNumbers: "on",
                  }}
                />
              </div>
            </Panel>
            <PanelResizeHandle/>
            <Panel minSize={15} order={2}>
              <div className="border-t border-gray-300 bg-white h-full">
              {/* Tabs */}
              <div className="flex border-b">
                {["run", "custom", "submit"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {tab === "run" && "Run Test"}
                    {tab === "custom" && "Custom Testcase"}
                    {tab === "submit" && "Submit"}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-4 h-full overflow-auto">
                {activeTab === "run" && (
                  <div className=''>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                      onClick={handleRunCode}
                    >
                      Run
                    </button>

                    {output?.length > 0 ? (
                      <div className="my-8 border border-gray-300 rounded bg-white shadow-sm">
                        {output.map((result, index) => (
                          <div
                            key={index}
                            className="border-b border-gray-200 p-3 hover:bg-gray-50 transition"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800">
                                Test Case {index + 1}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-sm font-semibold ${
                                  result.status === "OK"
                                    ? "bg-green-100 text-green-700"
                                    : result.status === "TLE"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {result.status}
                              </span>
                            </div>

                            <div className="mt-2 text-sm">
                              <div className="bg-gray-50 p-2 rounded mb-2">
                                <strong>Input:</strong>
                                <pre className="whitespace-pre-wrap">{result.input}</pre>
                              </div>

                              <div className="bg-gray-50 p-2 rounded mb-2">
                                <strong>Expected Output:</strong>
                                <pre>{result.expectedOutput}</pre>
                              </div>

                              <div className="bg-gray-50 p-2 rounded mb-2">
                                <strong>Actual Output:</strong>
                                <pre
                                  className={
                                    result.passed ? "text-green-600" : "text-red-600"
                                  }
                                >
                                  {result.actualOutput || "No output"}
                                </pre>
                              </div>

                              {result.error && (
                                <div className="bg-red-50 text-red-700 p-2 rounded">
                                  <strong>Error:</strong>
                                  <pre className="whitespace-pre-wrap">{result.error}</pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <pre className="mt-3 bg-gray-100 p-2 rounded text-gray-600">
                        Output will appear here
                      </pre>
                    )}
                  </div>
                )}

                {activeTab === "custom" && (
                  <div>
                    <TextArea 
                      value={customInput} 
                      setValue={setCustomInput} 
                      placeholder="Enter your custom input here"
                      rows={3}
                    />
                    <button
                      className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
                      onClick={handleRunCodeCustom}
                    >
                      Run Custom
                    </button>
                    <pre className="my-3 bg-gray-100 p-2 rounded">{customOutput?.output || "Output will appear here"}</pre>
                    
                    {customOutput?.error && (
                      <div className="bg-red-50 text-red-700 p-2 mb-8 rounded overflow-auto">
                        <strong>Error:</strong>
                        <pre className="whitespace-pre-wrap max-h-64 overflow-y-auto">{customOutput?.error}</pre>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "submit" && (
                  <div>
                    <p className="text-gray-600">Submit your final code for evaluation</p>
                    <button
                      className="mt-2 bg-purple-600 text-white px-4 py-1 rounded"
                      onClick={handleSubmitCode}
                    >
                      Submit
                    </button>
                    {submissionResult?.length > 0 && 
                      <SubmissionResults results={submissionResult} score={score}/>
                    }
                    
                  </div>
                )}
              </div>
            </div>
            </Panel>
          </PanelGroup>
        </div>
      </Panel>
    </PanelGroup>
  );
}

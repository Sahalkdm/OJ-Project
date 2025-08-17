import { useEffect } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { GetProblemById, ReviewCode, RunCustomTestCase, RunTestCases, SubmitCode } from '../../api/problemApi';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CustomResizeHandle } from '../PanelResizeHandler';
import Editor from '@monaco-editor/react';
import TextArea from '../TextArea';
import SubmissionResults from './SubmissionResult';
import LanguageDropdown from './LanguageDropdown';
import CodeReviewDisplay from './ReviewDisplay';
import { useDraft } from '../../hooks/useDraft';
import ProblemDescription from './ProblemDescription';
import SubmissionTable from './SubmissionTable';

export default function ProblemDisplay() {

    const { problem_id } = useParams();

    const [problem, setProblem] = useState(null);
    const [language, setLanguage] = useState('cpp');
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
    const [activeTabTop, setActiveTabTop] = useState("description"); // "description" | "submissions"
    const [reviewData, setReviewData] = useState(null);
    const [isEdited, setIsEdited] = useState(false);
    const [buttonLoadings, setButtonLoadings] = useState({run:false, submit:false, custom:false, review:false})

    const { code: initialDraft, saveDraft, clearDraft, loading } = useDraft({ problemId:problem_id, language });

    const initialCode = {
      py:"print('hello world!')",
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws Exception {
        // class should be Main
    }
}`,
      cpp:`#include <iostream>

int main() {

    return 0;
}`,
    }
    
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

    useEffect(()=>{
      setIsEdited(false);
    },[language]);

    // Set initial draft to code state once loaded
  useEffect(() => {
    let initCode;
    if (isEdited){
      initCode = "";
    }else{
      initCode = initialCode[language];
    }
    if (!loading) {
      setCode(initialDraft || initCode);
    };
  }, [initialDraft, loading, language]);
    
    const handleError = (err) =>
    toast.error(err, {
        position: "bottom-left",
    });

    const handleSuccess = (msg) =>
      toast.success(msg, {
          position: "bottom-right",
    });

    const handleEditorChange = (newCode) => {
      setCode(newCode);   // update local state
      saveDraft(newCode); // throttled save to IndexedDB
      setIsEdited(true);
    };

      const handleRunCodeCustom = async () => {
        setButtonLoadings({...buttonLoadings, custom:true})
        try {
            const res = await RunCustomTestCase(language, code, customInput);
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
        }finally{
          setButtonLoadings({...buttonLoadings, custom:false})
        }
    }

    const handleRunCode = async () => {
      setButtonLoadings({...buttonLoadings, run:true})
        try {
            const res = await RunTestCases(language, code, problem?.examples);
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
        }finally{
          setButtonLoadings({...buttonLoadings, run:false})
        }
    }

    const handleSubmitCode = async () => {
      setButtonLoadings({...buttonLoadings, submit:true})
        try {
            const res = await SubmitCode(language, code, problem?._id);
            const { success, message, output, score } = res;
            console.log(res);
            if (success){
              handleSuccess(message);
              setSubmissionResult(output);
              setScore(score)
              // clearDraft();
            }else{
              handleError(message);
            }
        } catch (error) {
            console.log(error);
            setRunError(error?.output || "Error");
            setOutput(error?.output);
            handleError(error?.message || "Error running the code");
        }finally{
          setButtonLoadings({...buttonLoadings, submit:false})
        }
    }

        const handleReviewCode = async () => {
          setButtonLoadings({...buttonLoadings, review:true})
        try {
            const res = await ReviewCode(language, code);
            const { success, message, review } = res;
            console.log(res);
            if (success){
              setReviewData(review);
            }else{
              handleError(message);
            }
        } catch (error) {
            handleError(error?.message || "Error running the code");
        }finally{
          setButtonLoadings({...buttonLoadings, review:false})
        }
    }

    if (!problem){
        return <div>Problem Not Loaded</div>
    }

  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={50} minSize={30} order={1}>
  <div className="px-6 py-3 space-y-6 overflow-y-auto h-full">
    {/* Top Tab Bar */}
      <div className="flex border-b border-gray-300 dark:border-gray-700 mb-4">
        <button
          onClick={() => setActiveTabTop("description")}
          className={`px-4 py-2 font-medium ${
            activeTabTop === "description"
              ? "border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Problem
        </button>
        <button
          onClick={() => setActiveTabTop("submissions")}
          className={`px-4 py-2 font-medium ${
            activeTabTop === "submissions"
              ? "border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Submissions
        </button>
      </div>
      {activeTabTop === 'description' ? 
        <ProblemDescription problem={problem}/>
        :
        <SubmissionTable problem_id={problem_id} setCode={setCode} setLanguage={setLanguage}/>
      }
      
  </div>
</Panel>

      <CustomResizeHandle/>
      {/* <PanelResizeHandle className="w-2 bg-gray-300 cursor-col-resize" /> */}
      <Panel minSize={30} order={2}>
        <div className="p-2 h-full"> 
          <PanelGroup direction='vertical'>
            <Panel defaultSize={60} minSize={30} order={1}>
              {/* Code editor */}
              <div className='h-full flex flex-col gap-1 overflow-auto'>
              <div className='flex justify-end'>
                <LanguageDropdown selected={language} setSelected={setLanguage}/> 
              </div>
              
              <div className='flex-1 overflow-hidden rounded-md h-full border p-1'>
                <Editor 
                  value={code} 
                  onChange={(val)=>handleEditorChange(val)}
                  theme="vs-dark"
                  defaultLanguage={'cpp'}
                  language={language === 'py' ? 'python' : language}
                  height={'100%'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine:false,
                    lineNumbers: "on",
                    scrollbar:{
                      vertical: 'auto',   // Show vertical scrollbar only when needed
                      horizontal: 'auto'  // Show horizontal scrollbar only when needed
                    }
                  }}
                />
              </div>
              </div>
            </Panel>
            <PanelResizeHandle/>
            <Panel minSize={15} order={2}>
              <div className="border-gray-300 dark:border-gray-700 h-full flex flex-col gap-2">
                {/* Tabs */}
                <div className="flex border-b border-gray-300 dark:border-gray-700">
                  {["run", "custom", "submit", "AIReview"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === tab
                          ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {tab === "run" && "Run Test"}
                      {tab === "custom" && "Custom Testcase"}
                      {tab === "submit" && "Submit"}
                      {tab === "AIReview" && "AI Review"}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="p-2 h-full overflow-auto text-gray-700 dark:text-gray-200">
                  {activeTab === "run" && (
                    <div>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                        onClick={handleRunCode}
                        disabled={buttonLoadings['run']}
                      >
                        {buttonLoadings['run']? 'Running...' :'Run'}
                      </button>

                      {output?.length > 0 ? (
                        <div className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 shadow-sm mt-2">
                          {output.map((result, index) => (
                            <div
                              key={index}
                              className="border-b border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  Test Case {index + 1}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-sm font-semibold ${
                                    result.status === "OK"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                      : result.status === "TLE"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                  }`}
                                >
                                  {result.status}
                                </span>
                              </div>

                              <div className="mt-2 text-sm">
                                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                                  <strong>Input:</strong>
                                  <pre className="whitespace-pre-wrap">{result.input}</pre>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                                  <strong>Expected Output:</strong>
                                  <pre>{result.expectedOutput}</pre>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded mb-2">
                                  <strong>Actual Output:</strong>
                                  <pre
                                    className={
                                      result.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                    }
                                  >
                                    {result.actualOutput || "No output"}
                                  </pre>
                                </div>

                                {result.error && (
                                  <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded">
                                    <strong>Error:</strong>
                                    <pre className="whitespace-pre-wrap">{result.error}</pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <pre className="mt-3 bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-600 dark:text-gray-400">
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
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                        onClick={handleRunCodeCustom}
                        disabled={buttonLoadings['custom']}
                      >
                        {buttonLoadings['custom']? 'Running...' :'Run Custom'}
                      </button>
                      <pre className="my-3 bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-700 dark:text-gray-300">
                        {customOutput?.output || "Output will appear here"}
                      </pre>

                      {customOutput?.error && (
                        <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 mb-8 rounded overflow-auto">
                          <strong>Error:</strong>
                          <pre className="whitespace-pre-wrap max-h-64 overflow-y-auto">{customOutput?.error}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "submit" && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Submit your final code for evaluation</p>
                      <button
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded"
                        onClick={handleSubmitCode}
                        disabled={buttonLoadings['submit']}
                      >
                        {buttonLoadings['submit']? 'Submitting...' :'Submit'}
                      </button>
                      {submissionResult?.length > 0 && (
                        <SubmissionResults results={submissionResult} score={score} />
                      )}
                    </div>
                  )}

                  {activeTab === "AIReview" && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Get Review of your code</p>
                      <button
                        className="my-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded"
                        onClick={handleReviewCode}
                        disabled={buttonLoadings['review']}
                      >
                        {buttonLoadings['review']? 'Reviewing...' :'Get Review'}
                      </button>
                      {reviewData && <CodeReviewDisplay reviewData={reviewData} />}
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

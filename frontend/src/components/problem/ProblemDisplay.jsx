import { useEffect } from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { GetProblemById } from '../../api/problemApi';
import { ToastContainer, toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CustomResizeHandle } from '../PanelResizeHandler';

export default function ProblemDisplay() {

    const { problem_id } = useParams();

    const [problem, setProblem] = useState(null);
    
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

    console.log(problem)
    
    const handleError = (err) =>
    toast.error(err, {
        position: "bottom-left",
    });

    const handleSuccess = (msg) =>
    toast.success(msg, {
        position: "bottom-right",
    });

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
        <div className="p-4 bg-gray-100 h-80"> {/* Code editor */} </div>
      </Panel>
    </PanelGroup>
  );
}

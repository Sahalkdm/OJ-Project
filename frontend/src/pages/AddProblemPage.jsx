import React, { useState } from "react";
import TextArea from "../components/TextArea";
import { createProblem, GetProblemById, UpdateProblem } from "../api/problemApi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";

const AddProblemPage = () => {

  const { problem_id } = useParams(); // id will be undefined when adding new
  console.log(problem_id)
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sampleIO, setSampleIO] = useState([
    { input: "", output: "", explanation: "" },
  ]);
  const [constraints, setConstraints] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");

  useEffect(() => {
    if (problem_id) {
      const fetchProblem = async () => {
        try {
          const res = await GetProblemById(problem_id); // create this API call
          const {problem, success, message} = res
          if (success) {
            setTitle(problem.title);
            setStatement(problem.statement);
            setDifficulty(problem.difficulty);
            setSampleIO(problem.examples || [{ input: "", output: "", explanation: "" }]);
            setConstraints(problem.constraints);
            setInputFormat(problem.input_format);
            setOutputFormat(problem.output_format);
          }else{
            handleError(message);
          }
        } catch (error) {
          handleError("Failed to load problem data");
        }
      };
      fetchProblem();
    }else{
      resetForm();
    }
  }, [problem_id,]);


  const resetForm = () => {
    setTitle("");
    setStatement("");
    setDifficulty("");
    setSampleIO([{ input: "", output: "", explanation: "" }]);
    setConstraints("");
    setInputFormat("");
    setOutputFormat("");
  };

  const handleSampleChange = (index, field, value) => {
    const updated = [...sampleIO];
    updated[index][field] = value;
    setSampleIO(updated);
  };

  const addSample = () => {
    setSampleIO([...sampleIO, { input: "", output: "", explanation: "" }]);
  };

  const removeSample = (index) => {
    const updated = [...sampleIO];
    updated.splice(index, 1);
    setSampleIO(updated);
  };

    const handleError = (err) =>
      toast.error(err, {
        position: "bottom-left",
      });
  
    const handleSuccess = (msg) =>
      toast.success(msg, {
        position: "bottom-right",
      });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = {
      title,
      statement,
      difficulty,
      examples: sampleIO,
      constraints,
      input_format: inputFormat,
      output_format: outputFormat,
    };
    console.log("Submitted Problem:", problem);
    try {
      
      let res;
      if (problem_id) {
        // Update existing problem
        res = await UpdateProblem(problem_id, problem);
      } else {
        // Create new problem
        res = await createProblem(problem);
      }

      const { success, message } = res;

      if (success){
        handleSuccess(message);
        resetForm();
        navigate('/problems');
      }else{
        handleError(message)
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg my-8 dark:bg-gray-800 dark:text-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-50">{problem_id ? 'Update Problem' : 'Add New Problem'}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <TextArea label="Title" value={title} setValue={setTitle} rows={2} placeholder="Enter problem title" />
        <TextArea label="Statement" value={statement} setValue={setStatement} rows={6} placeholder="Describe the problem statement" />

        {/* Difficulty Dropdown */}
        <div className="flex flex-col gap-1 mb-4 w-full">
          <label className="font-semibold text-gray-800">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-50"
          >
            <option value={"Easy"}>Easy</option>
            <option value={"Medium"}>Medium</option>
            <option value={"Hard"}>Hard</option>
          </select>
        </div>

        {/* Dynamic Input/Output Pairs */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-800 mb-2">Sample Inputs & Outputs</label>
          {sampleIO.map((sample, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start gap-2 mb-3 relative">
              <textarea
                className="flex-1 border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-900 text-gray-800 dark:text-gray-200 dark:border-gray-700"
                placeholder={`Sample Input ${index + 1}`}
                value={sample.input}
                rows={2}
                onChange={(e) => handleSampleChange(index, "input", e.target.value)}
              />
              <textarea
                className="flex-1 border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-900 text-gray-800 dark:text-gray-200 dark:border-gray-700"
                placeholder={`Sample Output ${index + 1}`}
                value={sample.output}
                rows={2}
                onChange={(e) => handleSampleChange(index, "output", e.target.value)}
              />
              <textarea
                className="flex-1 border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:bg-gray-900 text-gray-800 dark:text-gray-200 dark:border-gray-700"
                placeholder={`Explanation ${index + 1} (Optional)`}
                value={sample.explanation}
                rows={2}
                onChange={(e) => handleSampleChange(index, "explanation", e.target.value)}
              />

              {sampleIO.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSample(index)}
                  className="text-red-500 hover:text-red-700 transition mt-1 md:mt-0"
                  title="Remove this sample"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addSample}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            + Add Sample
          </button>
        </div>

        <TextArea label="Constraints" value={constraints} setValue={setConstraints} rows={3} placeholder="Any input/output constraints" />
        <TextArea label="Input Format" value={inputFormat} setValue={setInputFormat} rows={3} placeholder="Explain input format here" />
        <TextArea label="Output Format" value={outputFormat} setValue={setOutputFormat} rows={3} placeholder="Explain output format here" />

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {problem_id ? 'Update Problem' : 'Submit Problem'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProblemPage;

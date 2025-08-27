import React from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { DeleteTestCase, GetProblemById, getTestCasesByProblem, SaveTestCases, UpdateTestCase } from '../api/problemApi';
import Button from '../components/Button';
import { handleError, handleSuccess } from '../utils/toastFunctions';

function AddTestCases() {

    const {problem_id} = useParams();
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [testCases, setTestCases] = useState([
        { input: '', output: '', hidden: true },
    ]);
    const [existingTestCases, setExistingTestCases] = useState([]);

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

        const fetchProblemTestCases = async () =>{
            try {
                const res = await getTestCasesByProblem(problem_id);
                if (res?.success){
                    setExistingTestCases(res?.testcases)
                }else{
                    handleError(res?.message || "Error loading problem")
                }
            } catch (error) {
                handleError(error?.message || "Error loading problem")
            }
        }

        fetchProblem();
        fetchProblemTestCases();
    },[]);

    const handleTestCaseChange = (index, field, value, type='new') => {
        if (type === 'new'){
            const updated = [...testCases];
            updated[index][field] = value;
            setTestCases(updated);
        }else{
            const updated = [...existingTestCases];
            updated[index][field] = value;
            setExistingTestCases(updated);
        }
    };

    const toggleHidden = (index, type='new') => {
        if (type === 'new'){
            const updated = [...testCases];
            updated[index].hidden = !updated[index].hidden;
            setTestCases(updated);
        }else{
            const updated = [...existingTestCases];
            updated[index].hidden = !updated[index].hidden;
            setExistingTestCases(updated);
        }
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: '', output: '', hidden: true }]);
    };

    const removeTestCase = (index) => {
        const updated = [...testCases];
        updated.splice(index, 1);
        setTestCases(updated);
    };

    if (!problem){
        return <div>Problem Loading...</div>
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await SaveTestCases(problem._id, testCases);
    
            const { success, message } = res;
    
            if (success){
                handleSuccess(message);
                setTestCases([{ input: '', output: '', hidden: true }]);
                navigate('/problems');
            }else{
                handleError(message);
            }
        } catch (error) {
            handleError(error?.message || "Error submitting test cases")
        }

    }

    const handleUpdateTestCase = async (index) => {
        try {
            const testcase = existingTestCases[index];
            const res = await UpdateTestCase(testcase?._id, testcase);
            const { success, message, updatedTestCase } = res;
    
            if (success){
            handleSuccess(message);
            const tempCases = [...existingTestCases];
            tempCases[index] = {_id: updatedTestCase?._id, input: updatedTestCase?.input, output: updatedTestCase?.output, hidden: updatedTestCase?.hidden }
            setExistingTestCases(tempCases);
            }else{
            handleError(message);
            }
        } catch (error) {
            handleError(error?.message || "Error Updating test case");
        }
    }

    const handleDeleteTestCase = async (id, index) => {
        try {
            const res = await DeleteTestCase( id );
    
            const { success, message, deleted } = res;
    
            if (success){
            handleSuccess(message);
            const tempCases = [...existingTestCases];
            tempCases.splice(index, 1);
            setExistingTestCases(tempCases);
            }else{
            handleError(message);
            }
        } catch (error) {
            handleError(error?.message || "Error deleting test case");
        }
    }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg my-8 dark:bg-gray-800 dark:text-gray-50">
        {/* Dynamic Test Cases */}
        <form className='w-full' onSubmit={handleOnSubmit}>
        <div className="mb-6">
            <div>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-50 text-center'>Problem - {problem?.title}</h1>
            </div>
        
        <label className="block font-semibold text-gray-800 my-2 text-xl dark:text-gray-50 text-center">Test Cases</label>

        {existingTestCases?.length > 0 && <div className='block font-semibold text-gray-700 mb-2 dark:text-gray-100'>Existing Test Cases</div>}

        {existingTestCases.length > 0 && existingTestCases.map((tc, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 items-center mb-3 relative p-3 rounded-md shadow">
            
            {/* Input Field */}
            <textarea
                className="flex-1 border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 dark:border-gray-700"
                placeholder={`Input ${index + 1}`}
                value={tc.input}
                rows={3}
                onChange={(e) => handleTestCaseChange(index, "input", e.target.value, 'existing')}
            />

            {/* Output Field */}
            <textarea
                className="flex-1 border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 dark:border-gray-700"
                placeholder={`Output ${index + 1}`}
                value={tc.output}
                rows={3}
                onChange={(e) => handleTestCaseChange(index, "output", e.target.value, 'existing')}
            />

            <div className='flex flex-col justify-center items-center gap-1'>
            {/* Hidden Switch */}
            <button
                type="button"
                onClick={() => toggleHidden(index, 'existing')}
                className={`text-sm px-3 py-1 rounded font-medium transition ${
                tc.hidden
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                title="Toggle Hidden/Visible"
            >
                {tc.hidden ? "Hidden" : "Visible"}
            </button>

            {/* Delete Button */}
                <button
                type="button"
                onClick={() => handleDeleteTestCase(tc?._id, index)}
                className="text-red-500 hover:text-red-700 text-xl"
                title="Remove this test case"
                >
                🗑️
                </button>
                <button
                type="button"
                onClick={() => handleUpdateTestCase(index)}
                className={`text-sm px-3 py-1 rounded font-medium transition bg-gray-600 text-white hover:bg-gray-700}`}
                title="Save changes"
            >
                Save
            </button>
            </div>
            </div>
        ))}

        <div className='block font-semibold text-gray-700 mb-2 w-full border-t mt-10 dark:text-gray-100'>Add New Test Cases</div>

        {testCases.map((tc, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 items-center mb-3 relative p-3 rounded-md shadow">
            
            {/* Input Field */}
            <textarea
                className="flex-1 border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 dark:border-gray-700"
                placeholder={`Input ${index + 1}`}
                value={tc.input}
                rows={3}
                onChange={(e) => handleTestCaseChange(index, "input", e.target.value, 'new')}
            />

            {/* Output Field */}
            <textarea
                className="flex-1 border border-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 dark:border-gray-700"
                placeholder={`Output ${index + 1}`}
                value={tc.output}
                rows={3}
                onChange={(e) => handleTestCaseChange(index, "output", e.target.value, 'new')}
            />

            <div className='flex flex-col justify-center items-center'>
            {/* Hidden Switch */}
            <button
                type="button"
                onClick={() => toggleHidden(index, 'new')}
                className={`text-sm px-3 py-1 rounded font-medium transition ${
                tc.hidden
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                title="Toggle Hidden/Visible"
            >
                {tc.hidden ? "Hidden" : "Visible"}
            </button>

            {/* Delete Button */}
            {testCases.length > 1 && (
                <button
                type="button"
                onClick={() => removeTestCase(index)}
                className="text-red-500 hover:text-red-700 text-xl"
                title="Remove this test case"
                >
                🗑️
                </button>
            )}
            </div>
            </div>
        ))}

        <button
            type="button"
            onClick={addTestCase}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
            + Add Test Case
        </button>
        </div>
        <div className='text-center'>
            <Button type='submit' variant='success' className='font-semibold'>Save New Test Cases</Button>
        </div>
        </form>
    </div>
  )
}

export default AddTestCases

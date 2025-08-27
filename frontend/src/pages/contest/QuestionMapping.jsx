import React, { useState, useRef, useEffect } from "react";
import { handleError, handleSuccess } from "../../utils/toastFunctions";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { deleteProblemMapping, mapProblemsToContest, updateProblemMapping } from "../../api/contestApi";
import Button from "../../components/Button";
import { IoIosArrowDown } from "react-icons/io";

const SearchableDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const menuRef = useRef(null);

  // Filter options based on search input
  const filteredOptions = options.filter((opt) =>
    opt.title.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>{value ? options.find((opt) => opt._id == value)?.title : "Select Problem"}</span>
        <IoIosArrowDown className="w-4 h-4"/>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 p-1 space-y-1">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full px-3 py-2 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none"
            autoComplete="off"
          />

          {/* Options list */}
          <div className="max-h-56 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt._id}
                  onClick={() => {
                    onChange(opt._id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-md"
                >
                  {opt.title}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage inside your Question Mapping row
export default function QuestionMapping() {

  const {contestId} = useParams();

  const navigate = useNavigate();
  const { contestData, fetchSectionData, updateContestData } = useOutletContext();

  const [questions, setQuestions] = useState([
    { questionId: "", maxScore: '100' },
  ]);

  const [existingQuestions, setExistingQuestions] = useState([]);
  
  // const [problems, setProblems] = useState([]);
  
  useEffect(() => {
    if (!contestData.problems) {
      fetchSectionData("problems");
    }
  }, [contestData.problems, fetchSectionData]);

  useEffect(()=>{
    if (!contestData.contestProblems){
      fetchSectionData("contestProblems");
    }

    if (contestData?.contestProblems?.length > 0){
      setExistingQuestions(
         contestData?.contestProblems?.map((q) => ({
          problemId: q.problemId,
          maxScore: q.maxScore,
          title: q.title,
          isChanged: false,
        }))
      );
    }
  },[fetchSectionData, contestData.contestProblems])

  if (!contestData.problems) {
    return <div className="flex justify-center items-center h-40">Loading...</div>;
  }

  const problems = contestData?.problems;
  //const existingProblems = contestData?.contestProblems || [];

  const handleAdd = () => {
    setQuestions([...questions, { questionId: "", maxScore: '100' }]);
  };

  const handleRemove = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value, isNew=true) => {
    if (isNew){
      const updated = [...questions];
      updated[index][field] = value;
      setQuestions(updated);
    }else{
      const updated = [...existingQuestions];
      updated[index][field] = value;
      updated[index].isChanged = true;
      setExistingQuestions(updated);
    }
  };

  const handleSaveQuestions = async () => {
     // Remove duplicates inside the new batch itself
  const filteredQuestions = questions
    // 1. Remove empty IDs
    .filter(q => q.questionId.trim() !== "")
    // 2. Remove duplicates within `questions` itself
    .filter((q, index, self) => 
      index === self.findIndex(item => item.questionId === q.questionId)
    )
    // 3. Remove those already in existingProblems
    .filter(q => 
      !existingQuestions.some(p => p.problemId === q.questionId)
    );
    try {
      if (filteredQuestions.length === 0){
        handleError("Enter valid question, No dublicates allowed");
        return;
      }
      const res = await mapProblemsToContest({contestId, questions:filteredQuestions});
      if (res.success){
        handleSuccess(res.message);
        // Step 1: Enrich newProblems with title from problems list
        const enrichedProblems = filteredQuestions.map((np) => {
          const problemInfo = problems.find((p) => p._id === np.questionId);
          return {
            ...np,
            problemId: np.questionId,
            title: problemInfo ? problemInfo.title : "Unknown Title",
          };
        });

        // Step 2: Concatenate with existing contestProblems
        updateContestData("contestProblems", [...(existingQuestions || []), ...enrichedProblems]);
        setQuestions([]);
      }else{
        handleError(res.message);
      }
    } catch (error) {
      handleError(error.message || "Server Error");
    }
  }

  async function handleDeleteProblem(problemId) {
    try {
      const res = await deleteProblemMapping(problemId, contestId);
      if (res.success){
        handleSuccess(res.message);
        const updatedExistingQuestions = existingQuestions.filter((q, i) => q.problemId !== problemId);
        setExistingQuestions(updatedExistingQuestions);
        updateContestData("contestProblems", updatedExistingQuestions);
      }else{
        handleError(res.message);
      }
    } catch (error) {
      handleError(error?.message || "Error deleting problem")
    }
  }

  async function handleSaveChanges(problemId, index) {
    const maxScore = existingQuestions[index].maxScore;
    try {
      const res = await updateProblemMapping({maxScore: maxScore}, problemId, contestId);
      if (res.success){
        handleSuccess(res.message);
        const updated = [...existingQuestions];
        updated[index].maxScore = maxScore;
        updated[index].isChanged = false;
        setExistingQuestions(updated);
        updateContestData("contestProblems", updated);
      }else{
        handleError(res.message);
      }
    } catch (error) {
      handleError(error?.message || "Error updating problem");
    }
  }

  return (
    <div className="p-6 rounded-lg shadow-md h-full max-w-4xl mx-auto">
      <h2 className="text-lg h-[7%] font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Question Mapping
      </h2>
      <div className="overflow-auto h-[93%]">
        <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Problem
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Mark
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {existingQuestions?.length > 0 && existingQuestions?.map((q, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 dark:border-gray-700"
              >
                <td className="px-4 py-2">
                  {q?.title}
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={q.maxScore}
                    onChange={(e) => handleChange(index, "maxScore", e.target.value, false)}
                    className="w-20 px-2 py-1 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {q.isChanged && <button
                    onClick={() => handleSaveChanges(q.problemId, index)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  >
                    Save
                  </button>}
                  <button
                    onClick={() => handleDeleteProblem(q.problemId)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-300 dark:border-gray-700 dark:bg-gray-700 bg-gray-100">
              <td className="px-4 py-2 font-medium">Add New Problems</td>
              <td className="px-4 py-2"></td>
              <td className="px-4 py-2"></td>
            </tr>
            {questions.map((q, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 dark:border-gray-700"
              >
                <td className="px-4 py-2">
                  <SearchableDropdown
                    options={problems}
                    value={q.questionId}
                    onChange={(val) => handleChange(index, "questionId", val, true)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={q.maxScore}
                    onChange={(e) => handleChange(index, "maxScore", e.target.value, true)}
                    className="w-20 px-2 py-1 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleRemove(index)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            + Add Question
          </button>
        </div>

        <div className="text-center py-2">
          <Button variant="success" onClick={handleSaveQuestions}>Save New Problems</Button>
        </div>
      </div>
    </div>
  );
}

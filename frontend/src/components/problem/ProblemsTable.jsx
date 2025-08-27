import React, { useMemo } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { DeleteProblem, GetAllProblems } from '../../api/problemApi';
import { Link } from 'react-router-dom';
import ConfirmModal from '../CofirmModal';
import { FaEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { LuCircleCheckBig } from "react-icons/lu";
import { handleError, handleSuccess } from '../../utils/toastFunctions';

function ProblemsTable() {
  const { user } = useSelector((state) => state.auth);
  const  tags  = useSelector((state) => state.tags.list);
  const theme = useSelector((state) => state.theme.theme) || "dark"; // dark | light
  const isAdmin = user?.isAdmin || false;

  const [problems, setProblems] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // ===== Modal Handlers =====
  const handleOpenModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await DeleteProblem(selectedId);
      if (res.success) {
        fetchProblems();
        handleSuccess(res.message);
      } else {
        handleError(res.message);
      }
    } catch (err) {
      handleError(err.message || "Error deleting problem!");
    } finally {
      setIsModalOpen(false);
    }
  };

  // ===== Fetch Problems =====
  const fetchProblems = async () => {
    try {
      const res = await GetAllProblems();
      if (res?.success) {
        setProblems(res?.problems);
      } else {
        handleError(res?.message || "Error loading problems");
      }
    } catch (error) {
      handleError(error?.message || "Error loading problems");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // ===== Filtering & Searching =====
  useEffect(() => {
    let result = [...problems];

    if (difficulty) {
      result = result.filter((p) => p.difficulty === difficulty);
    }

    if (tag) {
      result = result.filter((p) =>
        p.tags?.includes(tag)
      );
    }

    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
    setCurrentPage(1); // reset page when filters change
  }, [difficulty, tag, search, problems]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filtered.length / pageSize);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  return (
    <div
      className={`max-w-6xl mx-auto space-y-6 px-2 md:px-4 py-6 transition-colors ${
        theme === "dark" ? "text-gray-200" : "text-gray-900"
      }`}
    >
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">Problem List</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Sharpen your skills by solving curated coding challenges. 
          Filter and pick the ones that match your level.
        </p>
      </div>

      {/* Filters Section */}
      <div
        className={`shadow-md rounded-lg p-2 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={"border rounded-lg px-1 md:px-3 py-2 focus:outline-none focus:ring-2 "+(theme === 'dark' ? 'border-gray-600 bg-gray-700 focus:ring-blue-500' : 'focus:ring-gray-500')}
          >
            <option className='p-1' value="">All</option>
            <option className='p-1' value="Easy">Easy</option>
            <option className='p-1' value="Medium">Medium</option>
            <option className='p-1' value="Hard">Hard</option>
          </select>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Tags:</label>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className={"border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 "+(theme === 'dark' ? 'border-gray-600 bg-gray-700 focus:ring-blue-500' : 'focus:ring-gray-500')}
          >
            <option className='p-1' value="">All</option>
            {tags?.length > 0 && tags.map(tg=>(
              <option className='p-1' key={tg._id} value={tg.short_form || tg.name}>{tg.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-1/3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className={"w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 " + (theme === 'dark' ? "border-gray-600 bg-gray-700" : "")}
          />
        </div>
      </div>

      {/* Problems Table */}
      <div
        className={`relative flex flex-col w-full shadow-md rounded-lg overflow-auto ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full text-left">
          <thead>
            <tr className={(theme === 'light'?"bg-slate-100" : "bg-gray-700")}>
              <th className="p-4 text-sm font-medium">#</th>
              <th className="p-4 text-sm font-medium">Title</th>
              <th className="p-4 text-sm font-medium">Difficulty</th>
              {isAdmin && <th className="p-4 text-sm font-medium">Edit Cases</th>}
              {isAdmin && <th className="p-4 text-sm font-medium">Edit</th>}
              {isAdmin && <th className="p-4 text-sm font-medium">Delete</th>}
              {user && <th className="p-4 text-sm font-medium"></th>}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No problems found.
                </td>
              </tr>
            ) : (
              currentData.map((problem, index) => (
                <tr
                  key={problem._id}
                  className={"border-b " + (theme === 'dark'? "border-gray-700 dark:hover:bg-gray-700" :"hover:bg-slate-50")}
                >
                  <td className="p-4">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="p-4">
                    <Link
                      to={`/problem/${problem._id}`}
                      className={theme === "dark" ? "text-white" : "text-gray-900"}
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="p-4">{problem.difficulty}</td>
                  {isAdmin && (
                    <td className="p-4">
                      <Link
                        to={`/admin/add-testcases/${problem._id}`}
                        className="text-indigo-500"
                      >
                        Add/Edit
                      </Link>
                    </td>
                  )}
                  {isAdmin && (
                    <td className="p-4">
                      <Link
                        to={`/admin/add-problem/${problem._id}`}
                        className="text-blue-500"
                      >
                        <FaEdit />
                      </Link>
                    </td>
                  )}
                  {isAdmin && (
                    <td className="p-4">
                      <button
                        onClick={() => handleOpenModal(problem._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </td>
                  )}
                  {user && <td className="p-4"><LuCircleCheckBig className={`${problem?.status === 'accepted' ? "text-green-500" : problem?.status === 'attempted' ? "text-orange-400" : "hidden" }`} title={`${problem?.status === 'accepted' ? "Accepted" : problem?.status === 'attempted' ? "Attempted" : "hidden" }`}/></td>}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            <b>
              {(currentPage - 1) * pageSize + 1}–
              {(currentPage - 1) * pageSize + currentData.length}
            </b>{" "}
            of {filtered.length}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ?  `text-white ${theme === 'dark' ? 'border-indigo-600 bg-indigo-600' : 'bg-gray-600 border-gray-600'}` 
                    : "hover:bg-slate-100 dark:hover:bg-gray-500"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Are you sure you want to delete this problem?"
        message="This action cannot be undone and the problem will be permanently removed."
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default ProblemsTable;

import React, { useEffect, useState, useMemo } from "react";
import CodeModal from "./CodeModal";
import Button from "../Button";
import { FaCode } from "react-icons/fa";
import { CgSearch } from "react-icons/cg";

function SubmissionTableContest({submissions, perPage=10}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCode, setSelectedCode] = useState(null);
  // --- filter submissions by search ---
  const filteredData = useMemo(() => {
    return submissions.filter((item) => 
        item?.name?.toLowerCase().includes(search.toLowerCase()) || 
        item?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [submissions, search]);

  // --- pagination logic ---
  const totalPages = Math.ceil(filteredData.length / perPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto transition-colors duration-300">
      {/* Heading + Search */}
      <div className="w-full flex md:flex-row flex-col gap-2 justify-between items-center mb-4 mt-2 pl-3">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            submissions
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            All submissions for the contest
          </p>
        </div>
        <div className="ml-3">
          <div className="w-full max-w-sm min-w-[200px] relative">
            <input
              className="w-full pr-11 h-10 pl-3 py-2 bg-white dark:bg-slate-800 placeholder:text-slate-400 text-slate-700 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 dark:focus:border-slate-500 dark:hover:border-slate-500 shadow-sm focus:shadow-md"
              placeholder="Search Names or Emails..."
              value={search}
              onChange={(e) => {
                setCurrentPage(1); // reset to first page on search
                setSearch(e.target.value);
              }}
            />
            <button
              className="absolute text-gray-400 right-1 top-0.5 h-full px-2 bg-transparent rounded"
              type="button"
            >
              <CgSearch className="w-5 h-5 my-auto"/>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative pb-3 flex flex-col w-full h-full overflow-x-auto overflow-y-auto text-gray-700 dark:text-gray-200 shadow-lg rounded-lg bg-clip-border transition-colors duration-300">
        <table className="w-full text-left table-auto min-w-max border-l border-r dark:border-slate-700">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  #
                </p>
              </th>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Name
                </p>
              </th>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Problem
                </p>
              </th>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Language
                </p>
              </th>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Status
                </p>
              </th>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Score
                </p>
              </th>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Code
                </p>
              </th>
              <th className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Submission Time
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="p-6 text-slate-500 dark:text-slate-400 text-sm text-center"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedData.map((data, index) => {
                const globalIndex = (currentPage - 1) * perPage + index + 1;
                const statusClass =
                  data.status === "OK"
                    ? "text-green-700 dark:text-green-400 font-semibold"
                    : "text-red-600 dark:text-red-300 font-semibold"

                return (
                  <tr
                    key={data?._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <td className="px-4 py-2 ">
                      <p className={`block font-semibold text-sm`}>
                        {globalIndex}
                      </p>
                    </td>
                    <td className="px-4 py-2 ">
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {data?.name}
                      </p>
                    </td>
                    <td className="px-4 py-2 ">
                      <p className="font-medium text-slate-700 dark:text-slate-200">
                        {data?.problem_title}
                      </p>
                    </td>
                    <td className="px-4 py-2 ">
                      <p className="text-slate-700 dark:text-slate-200">
                        {data?.language}
                      </p>
                    </td>
                    <td className="px-4 py-2 ">
                      <p className={`block text-sm ${statusClass}`}>
                        {data?.status}
                      </p>
                    </td>
                    <td className="px-4 py-2 ">
                      <p className="text-slate-700 dark:text-slate-200">
                        {data?.score}
                      </p>
                    </td>
                    <td className="px-4 py-2 ">
                      <p className="text-slate-100 bg-stone-800 rounded-md hover:bg-stone-700 text-center p-2 w-fit cursor-pointer">
                        <FaCode onClick={() => setSelectedCode({code:data?.code, language:data?.language})}/>
                      </p>
                    </td>
                    <td className="px-4 py-2 ">
                      <p className="text-slate-700 dark:text-slate-200">
                        {new Date(data?.createdAt).toLocaleString()}
                      </p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 rounded-b-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing{" "}
            <b>
              {(currentPage - 1) * perPage + 1}–
              {Math.min(currentPage * perPage, filteredData.length)}
            </b>{" "}
            of {filteredData.length}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 min-w-9 min-h-9 text-sm rounded transition ${
                  currentPage === page
                    ? "text-white bg-slate-800 dark:bg-slate-600 border border-slate-800 dark:border-slate-600"
                    : "text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-600 transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      <CodeModal
        isOpen={!!selectedCode}
        onClose={() => setSelectedCode(null)}
        code={selectedCode?.code}
        language={selectedCode?.language} // or dynamic from sub.language
      />
    </div>
  );
}

export default SubmissionTableContest;

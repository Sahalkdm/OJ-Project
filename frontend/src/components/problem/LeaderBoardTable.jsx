import React, { useEffect, useState, useMemo } from "react";
import { GetLeaderboardInfo } from "../../api/problemApi";
import { toast } from "react-toastify";

function LeaderBoardTable() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await GetLeaderboardInfo();
        if (res?.success) {
          setLeaderboard(res?.leaderboard);
        } else {
          handleError(res?.message || "Error loading leaderboard");
        }
      } catch (error) {
        handleError(error?.message || "Error loading leaderboard");
      }
    };

    fetchLeaderboard();
  }, []);

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  // --- filter leaderboard by search ---
  const filteredData = useMemo(() => {
    return leaderboard.filter((item) =>
      item?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaderboard, search]);

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
            Leaderboard
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            See how you rank among others.
          </p>
        </div>
        <div className="ml-3">
          <div className="w-full max-w-sm min-w-[200px] relative">
            <input
              className="w-full pr-11 h-10 pl-3 py-2 bg-white dark:bg-slate-800 placeholder:text-slate-400 text-slate-700 dark:text-slate-200 text-sm border border-slate-200 dark:border-slate-700 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 dark:focus:border-slate-500 dark:hover:border-slate-500 shadow-sm focus:shadow-md"
              placeholder="Search Names..."
              value={search}
              onChange={(e) => {
                setCurrentPage(1); // reset to first page on search
                setSearch(e.target.value);
              }}
            />
            <button
              className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-transparent rounded"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-6 h-6 text-slate-600 dark:text-slate-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative flex flex-col w-full h-full overflow-x-auto overflow-y-auto text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-900 shadow-lg rounded-lg bg-clip-border transition-colors duration-300">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  #
                </p>
              </th>
              <th className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Name
                </p>
              </th>
              <th className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Score
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
                const rankClass =
                  globalIndex === 1
                    ? "text-yellow-600 dark:text-yellow-400 font-bold"
                    : globalIndex === 2
                    ? "text-gray-600 dark:text-gray-300 font-semibold"
                    : globalIndex === 3
                    ? "text-amber-700 dark:text-amber-400 font-semibold"
                    : "text-slate-700 dark:text-slate-200";

                return (
                  <tr
                    key={data?.user_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <td className="p-4 py-5">
                      <p className={`block font-semibold text-sm ${rankClass}`}>
                        {globalIndex}
                      </p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {data?.name}
                      </p>
                    </td>
                    <td className="p-4 py-5">
                      <p className="text-sm text-slate-700 dark:text-slate-200">
                        {data?.totalScore}
                      </p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
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
    </div>
  );
}

export default LeaderBoardTable;

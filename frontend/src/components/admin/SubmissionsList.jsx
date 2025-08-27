import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { GetAllSubmissions } from '../../api/problemApi';
import { handleError } from '../../utils/toastFunctions';
import { CgSearch } from 'react-icons/cg';

function SubmissionsList() {

    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const limit = 50; // rows per page

    const fetchSubmissions = async () =>{
        setLoading(true);
        try {
            const res = await GetAllSubmissions(page, limit, search);
            if (res?.success){
                setSubmissions(res?.submissions);
                setTotalPages(res?.totalPages);
                setTotalSubmissions(res?.totalSubmissions)
            }else{
                handleError(res?.message || "Error loading Submissions")
            }
        } catch (error) {
            handleError(error?.message || "Error loading Submissions")
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        const delay = setTimeout(() => {
            fetchSubmissions();
        }, 500); // 300ms debounce

        return () => clearTimeout(delay); // cancel if still typing
    }, [page, search, ]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // reset to first page whenever search changes
    };

  return (
    <div className='max-w-4xl mx-auto'>
        <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
            <div>
            <h3 className="text-lg font-semibold text-slate-800">Submissions</h3>
            <p className="text-slate-500">Overview of all Submissions.</p>
            </div>
            <div className="ml-3">
            <div className="w-full max-w-sm min-w-[200px] relative">
                <div className="relative">
                <input
                    onChange={handleSearchChange}
                    value={search}
                    className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                    placeholder="Search Names..."
                />
                <button
                  className="absolute text-gray-400 right-1 top-0.5 h-full px-2 bg-transparent rounded"
                  type="button"
                >
                  <CgSearch className="w-6 h-6 my-auto"/>
                </button>
                </div>
            </div>
            </div>
        </div>

        <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">#</th>
            <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">Problem</th>
            <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">Difficulty</th>
            <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">User</th>
            <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">Language</th>
            <th className="p-4 border-b border-slate-200 bg-slate-50 text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-slate-500">
                Loading...
              </td>
            </tr>
          ) : submissions?.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-slate-500 text-sm text-center">
                No Submissions found.
              </td>
            </tr>
          ) : (
            submissions?.map((data, index) => (
              <tr key={data?._id} className="hover:bg-slate-50 border-b border-slate-200">
                <td className="p-4 text-center">
                  {index + 1 + (page - 1) * limit}
                </td>
                <td className="p-4 text-center">{data?.problem?.title}</td>
                <td className="p-4 text-center">{data?.problem?.difficulty}</td>
                <td className="p-4 text-center">{data?.user?.firstname} {data?.user?.lastname}</td>
                <td className="p-4 text-center">{data?.language}</td>
                <td className="p-4 text-center">{data?.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="text-sm text-slate-500">
          Showing <b>{submissions?.length}</b> of {totalSubmissions}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 text-sm font-normal rounded ${
                page === i + 1
                  ? "text-white bg-slate-800"
                  : "text-slate-500 bg-white border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SubmissionsList
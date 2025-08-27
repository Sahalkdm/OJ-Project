import { useEffect } from "react";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { autoSubmitPendingUsers, deleteContest, getAllContests } from "../../api/contestApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ContestBanner from "../../components/contets/ContestBanner";
import { handleError, handleSuccess } from "../../utils/toastFunctions";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ConfirmModal from "../../components/CofirmModal";
import Button from "../../components/Button";

export default function ContestTable() {
  const {user} = useSelector(state=> state?.auth);

  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [contests, setContests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenClose, setIsModalOpenClose] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchContets = async () =>{
        try {
            const res = await getAllContests();
            if (res?.success){
                setContests(res?.contests)
            }else{
                handleError(res?.message || "Error loading problem")
            }
        } catch (error) {
            handleError(error?.message || "Error loading problem")
        }
    };
    fetchContets();
  },[])

  // Filter + Search
  const filteredContests = useMemo(() => {
    return contests.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
      const matchesDate = filterDate ? c.start_time.startsWith(filterDate) : true;
      return matchesSearch && matchesDate;
    });
  }, [contests, search, filterDate]);

  const now = Date.now();

  const handleDelete = async () => {
      try {
        const res = await deleteContest(selectedId);
        if (res.success) {
          handleSuccess(res.message);
          setContests((prev) => prev.filter((contest) => contest._id !== selectedId));
        } else {
          handleError(res.message);
        }
      } catch (err) {
        handleError(err.message || "Error deleting problem!");
      } finally {
        setIsModalOpen(false);
      }
    };

    const handleCloseContest = async () => {
      try {
        const res = await autoSubmitPendingUsers(selectedId);
        if (res.success) {
          handleSuccess(res.message);
          setContests((prev) =>
            prev.map((contest) =>
              contest._id === selectedId
                ? { ...contest, isClosed: true } // update property
                : contest // keep others unchanged
            )
          );
        } else {
          handleError(res.message);
        }
      } catch (err) {
        handleError(err.message || "Error closing contest!");
      } finally {
        setIsModalOpenClose(false);
      }
    };

  // ===== Modal Handlers =====
  const handleOpenModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOpenModalClose = (id) => {
    setSelectedId(id);
    setIsModalOpenClose(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ContestBanner/>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          🚀 MyCoddy Contests
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sharpen your coding skills by participating in our weekly and special contests. 
          Compete globally, improve your logic, and climb the leaderboard!
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search contests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Date Filter */}
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Start Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">End Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200"></th>
              {user?.isAdmin && <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Public</th>}
              {user?.isAdmin && <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Edit</th>}
              {user?.isAdmin && <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Delete</th>}
              {user?.isAdmin && <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Close</th>}
            </tr>
          </thead>
          <tbody>
            {filteredContests.length > 0 ? (
              filteredContests.map((contest) => {
                let durationHours;
                const start = new Date(contest.start_time);
                const end = new Date(contest.end_time);
                if (contest?.duration){
                  durationHours = contest?.duration;
                }else{
                  durationHours = Math.floor(
                    (end.getTime() - start.getTime()) / (1000 * 60)
                  );
                };

                return (
                  // change needed here on link
                  <tr
                    key={contest._id}
                    className={"border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 "}
                  >
                    <td 
                      className={"px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 " + (user?.isAdmin && "cursor-pointer")}
                      onClick={() => user?.isAdmin && navigate(`/admin/contests/${contest._id}`)}
                    >
                      {contest.title}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {start.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {end.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {durationHours} mins
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                      {contest.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate text-center">
                      {start?.getTime() > now ? (
                        // Contest has not started yet
                        <span className="inline-block p-2 w-20 rounded-md border border-gray-500 dark:text-gray-400 text-gray-700">
                          Upcoming
                        </span>
                      ) : end?.getTime() < now ? (
                        // Contest already ended
                        <Link
                          to={`/contest/${contest._id}`}
                          className="inline-block p-2 w-20 rounded-md border border-blue-700 hover:bg-blue-800 hover:text-white"
                        >
                          Visit
                        </Link>
                      ) : (
                        // Contest is live
                        <Link
                          to={`/contest/${contest._id}`}
                          className="inline-block w-20 p-2 rounded-md border border-green-600 hover:bg-green-600"
                        >
                          Start
                        </Link>
                      )}
                    </td>

                    {user?.isAdmin && <td className="px-4 py-3 text-sm">
                      {contest.isPublic ? (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200">
                          Private
                        </span>
                      )}
                    </td>}
                    {user?.isAdmin && <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                      <Link to={`/admin/manage-contest/${contest?._id}`}>
                        <FaEdit className="w-5 h-5 text-blue-500 mx-auto" title="Edit"/>
                      </Link>
                    </td>}
                    {user?.isAdmin && <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                        <FaTrashAlt
                          onClick={() => handleOpenModal(contest._id)}
                          className="w-4 h-4 text-red-500 mx-auto cursor-pointer" 
                          title="Delete"
                        />
                    </td>}
                    {user?.isAdmin && (!contest?.isClosed && <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                        <Button variant="danger" onClick={()=>handleOpenModalClose(contest?._id)}>Close</Button>
                    </td>)}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No contests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Are you sure you want to delete this contest?"
        message="This action cannot be undone and the contest will be permanently removed."
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ConfirmModal
        isOpen={isModalOpenClose}
        title="Are you sure you want to close this contest?"
        message="This action cannot be undone and the contest will be permanently closed. Users can not attend this contest any more!"
        confirmText="Yes, Proceed"
        cancelText="No, Cancel"
        onConfirm={handleCloseContest}
        onCancel={() => setIsModalOpenClose(false)}
      />
    </div>
  );
}

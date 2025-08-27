// src/pages/contests/ContestLayout.jsx
import { NavLink, Outlet, useParams } from "react-router-dom";
import { getContestById, getContestLeaderboard, getContestRegistrations, getContestSubmissions, getContestUserProblemScores, getProblemsContest } from "../../api/contestApi";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { GetAllProblems } from "../../api/problemApi";
import { handleError } from "../../utils/toastFunctions";

export default function ContestLayout() {
  const { contestId } = useParams();

  const [contest, setContest] = useState(null);
  // Master state for contest
  const [contestData, setContestData] = useState({
    info: null,
    leaderboard: null,
    analysis: null,
    registrations: null,
    questions: null,
    problems: null,
    submissions: null,
    contestProblems: null,
    userProblemScores: null,
  });

  const fetchContest = async()=>{
      try {
        const res = await getContestById(contestId);
        if (res.success) {
          setContest(res?.contest);
          setContestData((prev) => ({ ...prev, info: res?.contest }));
        }
        else handleError(res.message);
      } catch (error) {
        handleError(error.message || "Error fetching contest info")
      }
    }

  useEffect(()=>{
    if (!contest){
      fetchContest();
    }
  },[contestId]);

  const tabs = [
    { name: "Info", path: "" },
    { name: "Leaderboard", path: "leaderboard" },
    { name: "Analysis", path: "analysis" },
    { name: "Registrations", path: "registrations" },
    { name: "Submissions", path: "submissions" },
    { name: "Question Mapping", path: "questions" },
  ];

  // Function to fetch data lazily (called by children)
  const fetchSectionData = useCallback( async (section) => {
    if (contestData[section]) return; // already loaded

    try {
      let res;
      switch (section) {
        case "info":
          res = await getContestById(contestId);
          if (res.success) setContestData((prev) => ({ ...prev, info: res?.contest }));
          else handleError(res.message);
          break;
        case "problems":
          res = await GetAllProblems();
          if (res.success) setContestData((prev) => ({ ...prev, problems: res?.problems }));
          else handleError(res.message);
          break;
        case "contestProblems":
          res = await getProblemsContest(contestId);
          if (res.success) setContestData((prev) => ({ ...prev, contestProblems: res?.contest?.problems }));
          else handleError(res.message);
          break;
        case "leaderboard":
          res = await getContestLeaderboard(contestId);
          if (res.success) setContestData((prev) => ({ ...prev, leaderboard: res.leaderboard }));
          else handleError(res.message);
          break;
        case "submissions":
          res = await getContestSubmissions(contestId);
          if (res.success) setContestData((prev) => ({ ...prev, submissions: res.submissions }));
          else handleError(res.message);
          break;
        case "userProblemScores":
          res = await getContestUserProblemScores(contestId);
          setContestData((prev) => ({ ...prev, userProblemScores: res.data }));
          break;
        case "registrations":
          res = await getContestRegistrations(contestId);
          if (res.success) setContestData((prev) => ({ ...prev, registrations: res.registrations }));
          else handleError(res.message);
          break;
        default:
          break;
      }
    } catch (err) {
      handleError(`Error fetching ${section}`);
    }
  }, [contestId,]);

  const updateContestData = (section, newData, merge = false) => {
    try {
      setContestData((prev) => ({
      ...prev,
      [section]: merge && typeof prev[section] === "object"
        ? { ...prev[section], ...newData }  // merge update
        : newData,                         // replace update
    }));
    } catch (error) {
      handleError("Try refreshing the page");
    }
  };

  return (
    <div className="h-full text-gray-800 dark:text-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-l border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-2">
            <h1 className="text-lg font-semibold">Contest Management: {contest?.title}</h1>
          </div>
          {/* Tabs */}
          <nav className="flex space-x-6 mt-2">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={`/admin/contests/${contestId}/${tab.path}`}
                end
                className={({ isActive }) =>
                  `pb-2 text-sm font-medium border-b-2 ${
                    isActive
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="w-full mx-auto flex-grow overflow-auto">
        <Outlet context={{ contestData, fetchSectionData, updateContestData }} />
      </main>
    </div>
  );
}

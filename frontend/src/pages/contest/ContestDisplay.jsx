import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import QuestionTable from "../../components/contets/QuestionDisplay";
import LeaderBoardTable from "../../components/problem/LeaderBoardTable";
import ContestBanner from "../../components/contets/ContestBanner";
import { handleError, handleSuccess } from "../../utils/toastFunctions";
import { exitContest } from "../../api/contestApi";
import Button from "../../components/Button";
import ConfirmModal from "../../components/CofirmModal";

export default function ContestPage() {

  const { contestId } = useParams();
  const {problems, userStatusNow:userStatus, contestNow, setUserStatusNow, leaderboard} = useOutletContext();
  const navigate = useNavigate();

  const [tab, setTab] = useState("questions");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExitExam = async () => {
        try {
          const res = await exitContest(contestId);
          if (res.success) {
            handleSuccess(res.message);
            setUserStatusNow("Completed");
            navigate("/");
          } else {
            handleError(res.message);
          }
        } catch (err) {
          handleError(err.message || "Error while closing the contest!");
        } finally {
          setIsModalOpen(false);
        }
      };

      // ===== Modal Handlers =====
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="h-full text-gray-900 dark:text-gray-100 p-6">
      {/* Contest Details */}
      <div>
        <ContestBanner isButtonVisible={false} avlContest={contestNow}/>
      </div>

      {/* Tabs */}
      <div className="flex justify-between border-b border-gray-300 dark:border-gray-700 mb-4">
        <div className="flex">
        <button
          onClick={() => setTab("questions")}
          className={`px-4 py-2 ${
            tab === "questions"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Questions
        </button>
        <button
          onClick={() => setTab("leaderboard")}
          className={`px-4 py-2 ${
            tab === "leaderboard"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Leaderboard
        </button>
        </div>
        {userStatus === "Started" && <div className="p-1">
          <Button onClick={handleOpenModal} variant="success">Exit Exam</Button>
        </div>}
      </div>

      {/* Tab Content */}
      {tab === "questions" && (
        <div className="space-y-3 max-w-4xl mx-auto">
          <QuestionTable questions={problems} contestId={contestId} canNavigate={userStatus === "Started"}/>
        </div>
      )}

      {tab === "leaderboard" && (
        <div>
          <LeaderBoardTable leaderboard={leaderboard}/>
        </div>
      )}

      {/* Confirm Delete Modal */}
            <ConfirmModal
              isOpen={isModalOpen}
              title="Are you sure you want to exit this contest?"
              message="This action cannot be undone."
              confirmText="Yes, Exit"
              cancelText="No, Cancel"
              onConfirm={handleExitExam}
              onCancel={() => setIsModalOpen(false)}
            />
    </div>
  );
}










// import React, { useEffect, useMemo, useState } from "react";
// import { getProblemsContest } from "../../api/contestApi";
// import { useParams } from "react-router-dom";
// import { handleError } from "../../utils/toastFunctions";

// /**
//  * ContestView Component
//  * -----------------------------------------
//  * Props:
//  * - contest: {
//  *     id, title, description, rules, start_time, end_time, duration
//  *   }
//  * - questions: Array<{
//  *     id, title, difficulty: 'Easy'|'Medium'|'Hard', score: number,
//  *     status?: 'unattempted'|'attempted'|'accepted'
//  *   }>
//  * - leaderboard: Array<{
//  *     userId, name, score, rank
//  *   }>
//  * - onOpenQuestion?: (q) => void   // optional callback when a question is clicked
//  * - navigateToQuestion?: (q) => void // alternative navigation handler
//  * - theme?: 'light' | 'dark'       // optional theme override; otherwise follows OS/parent
//  */
// export default function ContestView({
//   contest,
//   questions = [],
//   leaderboard = [],
//   onOpenQuestion,
//   navigateToQuestion,
//   theme,
// }) {
//   const [activeTab, setActiveTab] = useState("questions");
//   const [search, setSearch] = useState("");
//   const [localStatuses, setLocalStatuses] = useState({});
//   const [nowTick, setNowTick] = useState(Date.now()); // drives countdown re-render
//     const [problems, setProblems] = useState([]);
//   const {contestId} = useParams();

//   const fetchProblems = async () => {
//     try {
//         const res = await getProblemsContest(contestId);
//         if (res.success){
//             setProblems(res.contest.problems);
//         }else{
//             handleError(res.message);
//         }
//     } catch (error) {
//         handleError(error.message || "Error loading problems, Try refresh")
//     }
//   }
//   useEffect(()=>{
    
//   })

//   // Ticking clock for countdown
//   useEffect(() => {
//     const t = setInterval(() => setNowTick(Date.now()), 1000);
//     return () => clearInterval(t);
//   }, []);

//   const start = useMemo(() => new Date(contest?.start_time || 0), [contest?.start_time]);
//   const end = useMemo(() => new Date(contest?.end_time || 0), [contest?.end_time]);
//   const now = useMemo(() => new Date(nowTick), [nowTick]);

//   const { status, msLeft, ctaLabel } = useMemo(() => {
//     if (!contest) return { status: "", msLeft: 0, ctaLabel: "" };
//     if (now < start) return { status: "upcoming", msLeft: start - now, ctaLabel: "Register" };
//     if (now >= start && now <= end) return { status: "running", msLeft: end - now, ctaLabel: "Start" };
//     return { status: "ended", msLeft: 0, ctaLabel: "Ended" };
//   }, [contest, now, start, end]);

//   const timeParts = useMemo(() => formatDuration(msLeft), [msLeft]);

//   const filteredLeaderboard = useMemo(() => {
//     if (!search) return leaderboard;
//     return leaderboard.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
//   }, [leaderboard, search]);

//   const handleQuestionClick = (q) => {
//     // Mark as completed/accepted automatically (demo: accepted if score > 0)
//     setLocalStatuses((prev) => ({
//       ...prev,
//       [q.id]: q.status === "accepted" ? "accepted" : "completed",
//     }));

//     if (onOpenQuestion) onOpenQuestion(q);
//     else if (navigateToQuestion) navigateToQuestion(q);
//     else if (contest?.id) window.location.href = `/contests/${contest.id}/problems/${q.id}`;
//   };

//   const effectiveTheme = theme || undefined; // allows parent to control or rely on <html class="dark">

//   return (
//     <div className={
//       `w-full max-w-6xl mx-auto p-4 md:p-6 ${effectiveTheme === 'dark' ? 'dark' : ''}`
//     }>
//       {/* Header / Banner */}
//       <div className=
//         "relative overflow-hidden rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
//         <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
//           <div className="space-y-2">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
//               {status === 'upcoming' && 'Upcoming Contest'}
//               {status === 'running' && 'Live Now'}
//               {status === 'ended' && 'Finished'}
//             </div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
//               {contest?.title || 'Contest'}
//             </h1>
//             <p className="text-gray-600 dark:text-gray-300 max-w-2xl">{contest?.description}</p>
//             {contest?.rules && (
//               <details className="text-sm text-gray-600 dark:text-gray-300">
//                 <summary className="cursor-pointer select-none">Rules</summary>
//                 <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 mt-1">{contest.rules}</pre>
//               </details>
//             )}
//             <div className="flex flex-wrap gap-3 pt-2 text-sm text-gray-700 dark:text-gray-300">
//               <Badge label={`Starts: ${formatDateTime(start)}`} />
//               <Badge label={`Ends: ${formatDateTime(end)}`} />
//               {contest?.duration && <Badge label={`Duration: ${contest.duration} min`} />}
//             </div>
//           </div>

//           {/* Countdown + CTA */}
//           <div className="shrink-0 w-full sm:w-auto">
//             <div className="flex items-center justify-between sm:justify-center gap-4">
//               <Countdown {...timeParts} status={status} />
//               <button
//                 disabled={status === 'ended'}
//                 className={
//                   `px-5 py-2 rounded-xl font-semibold border transition-all active:scale-[0.98]
//                    ${status === 'running' ? 'bg-green-600 hover:bg-green-700 text-white border-green-700'
//                     : status === 'upcoming' ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
//                     : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-600'}
//                   `
//                 }
//                 onClick={() => {
//                   if (status === 'running') {
//                     // start contest -> maybe navigate to first question
//                     if (questions[0]) handleQuestionClick(questions[0]);
//                   }
//                 }}
//               >
//                 {ctaLabel}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="mt-6">
//         <div className="inline-flex rounded-xl p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//           <TabButton active={activeTab === 'questions'} onClick={() => setActiveTab('questions')}>Questions</TabButton>
//           <TabButton active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')}>Leaderboard</TabButton>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="mt-6">
//         {activeTab === 'questions' ? (
//           <QuestionList
//             items={questions}
//             localStatuses={localStatuses}
//             onClickItem={handleQuestionClick}
//           />
//         ) : (
//           <Leaderboard items={filteredLeaderboard} search={search} setSearch={setSearch} />
//         )}
//       </div>
//     </div>
//   );
// }

// function TabButton({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={
//         `px-4 py-2 text-sm rounded-lg transition-colors font-medium
//          ${active
//           ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow border border-gray-200 dark:border-gray-700'
//           : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}
//         `
//       }
//     >
//       {children}
//     </button>
//   );
// }

// function Badge({ label }) {
//   return (
//     <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
//       {label}
//     </span>
//   );
// }

// function Countdown({ days, hours, minutes, seconds, status }) {
//   const cell = (v, unit) => (
//     <div className="flex flex-col items-center">
//       <div className="min-w-[56px] text-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 text-xl font-bold text-gray-900 dark:text-gray-100">
//         {String(v).padStart(2, '0')}
//       </div>
//       <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{unit}</div>
//     </div>
//   );

//   return (
//     <div className="flex items-center gap-3">
//       {cell(days, 'D')}
//       <span className="text-gray-400">:</span>
//       {cell(hours, 'H')}
//       <span className="text-gray-400">:</span>
//       {cell(minutes, 'M')}
//       <span className="text-gray-400">:</span>
//       {cell(seconds, 'S')}
//     </div>
//   );
// }

// function QuestionList({ items, localStatuses, onClickItem }) {
//   const statusColor = (s) => {
//     switch (s) {
//       case 'accepted': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-700/30';
//       case 'completed': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-700/30';
//       default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-700/30';
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {items.map((q, idx) => {
//         const effStatus = localStatuses[q.id] || q.status || 'unattempted';
//         return (
//           <button
//             key={q.id}
//             onClick={() => onClickItem(q)}
//             className="group text-left w-full rounded-2xl p-4 border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-[1px] transition-all"
//           >
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <div className="text-xs text-gray-500 dark:text-gray-400">Question {idx + 1}</div>
//                 <h3 className="mt-1 font-semibold text-gray-900 dark:text-gray-100">{q.title}</h3>
//                 <div className="mt-2 flex flex-wrap gap-2 text-xs">
//                   <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-700/20">
//                     {q.difficulty}
//                   </span>
//                   <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-700/20">
//                     {q.score} pts
//                   </span>
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded-md border ${statusColor(effStatus)}`}>
//                     {effStatus}
//                   </span>
//                 </div>
//               </div>
//               <svg className="mt-1 size-5 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
//             </div>
//           </button>
//         );
//       })}

//       {items.length === 0 && (
//         <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400 border border-dashed rounded-2xl border-gray-300 dark:border-gray-700">
//           No questions available.
//         </div>
//       )}
//     </div>
//   );
// }

// function Leaderboard({ items, search, setSearch }) {
//   return (
//     <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
//       <div className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
//         <div className="font-semibold text-gray-900 dark:text-gray-100">Leaderboard</div>
//         <div className="relative w-full sm:w-72">
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name..."
//             className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
//           />
//           <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
//             <tr>
//               <th className="text-left px-4 py-3 font-medium">Rank</th>
//               <th className="text-left px-4 py-3 font-medium">Name</th>
//               <th className="text-left px-4 py-3 font-medium">Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((u) => (
//               <tr key={u.userId} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/50">
//                 <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">{u.rank}</td>
//                 <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{u.name}</td>
//                 <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{u.score}</td>
//               </tr>
//             ))}

//             {items.length === 0 && (
//               <tr>
//                 <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No results.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// // ---------- utils ----------
// function formatDuration(ms) {
//   if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//   const totalSeconds = Math.floor(ms / 1000);
//   const days = Math.floor(totalSeconds / (3600 * 24));
//   const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
//   const seconds = totalSeconds % 60;
//   return { days, hours, minutes, seconds };
// }

// function formatDateTime(d) {
//   if (!(d instanceof Date) || isNaN(d)) return "-";
//   return d.toLocaleString(undefined, {
//     year: 'numeric', month: 'short', day: '2-digit',
//     hour: '2-digit', minute: '2-digit'
//   });
// }

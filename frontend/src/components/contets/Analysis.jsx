import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/**
 * Contest Analysis Dashboard (Minimal)
 * - React + Tailwind + Recharts only
 * - No shadcn/ui, no Card/Button/Input, no icon libs
 * - Uses simple Tailwind containers
 *
 * Replace dummy data with API responses.
 */

// ===== Dummy Data (replace with real API data) =====
const problems = [
  { _id: "p1", title: "Arrays & Sums", maxScore: 100 },
  { _id: "p2", title: "Graph Paths", maxScore: 100 },
  { _id: "p3", title: "DP – Knapsack", maxScore: 100 },
  { _id: "p4", title: "Geometry", maxScore: 100 },
];

const registrations = [
  { user_id: "u1", status: "Started" },
  { user_id: "u2", status: "Completed" },
  { user_id: "u3", status: "Registered" },
  { user_id: "u4", status: "Completed" },
  { user_id: "u5", status: "Started" },
  { user_id: "u6", status: "Completed" },
  { user_id: "u7", status: "Registered" },
];

const scoresPerUser = [
  // user u1
  { user_id: "u1", problem_id: "p1", score: 60 },
  { user_id: "u1", problem_id: "p2", score: 0 },
  { user_id: "u1", problem_id: "p3", score: 30 },
  // user u2
  { user_id: "u2", problem_id: "p1", score: 100 },
  { user_id: "u2", problem_id: "p2", score: 100 },
  { user_id: "u2", problem_id: "p3", score: 90 },
  { user_id: "u2", problem_id: "p4", score: 10 },
  // user u4
  { user_id: "u4", problem_id: "p1", score: 70 },
  { user_id: "u4", problem_id: "p2", score: 40 },
  // user u5
  { user_id: "u5", problem_id: "p2", score: 10 },
  { user_id: "u5", problem_id: "p4", score: 0 },
  // user u6
  { user_id: "u6", problem_id: "p1", score: 100 },
  { user_id: "u6", problem_id: "p3", score: 100 },
];

const submissions = [
  // problem p1
  { problem_id: "p1", user_id: "u1", lang: "cpp", status: "AC" },
  { problem_id: "p1", user_id: "u2", lang: "py", status: "AC" },
  { problem_id: "p1", user_id: "u4", lang: "java", status: "WA" },
  { problem_id: "p1", user_id: "u6", lang: "cpp", status: "AC" },
  // problem p2
  { problem_id: "p2", user_id: "u1", lang: "cpp", status: "WA" },
  { problem_id: "p2", user_id: "u2", lang: "py", status: "AC" },
  { problem_id: "p2", user_id: "u4", lang: "java", status: "AC" },
  { problem_id: "p2", user_id: "u5", lang: "py", status: "WA" },
  // problem p3
  { problem_id: "p3", user_id: "u1", lang: "cpp", status: "AC" },
  { problem_id: "p3", user_id: "u2", lang: "py", status: "AC" },
  { problem_id: "p3", user_id: "u6", lang: "cpp", status: "AC" },
  // problem p4
  { problem_id: "p4", user_id: "u2", lang: "py", status: "WA" },
  { problem_id: "p4", user_id: "u5", lang: "cpp", status: "WA" },
];

// ===== Helpers =====
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const uniq = (arr) => Array.from(new Set(arr));
const by = (k) => (a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0);

function useComputedStats(problems, submissions, registrations, scoresPerUser) {
  const totalRegistered = registrations?.length;
  const attemptedUserIds = registrations?.filter((r) => r.status === "Completed").map(reg=>reg.user_id);
  const totalAttempted = attemptedUserIds.length;

  const totalScoreByUser = attemptedUserIds.map((uid) =>
    sum(scoresPerUser?.filter((x) => x.user_id === uid).map((x) => x.best_score))
  );
  const averageScoreOverall =
    totalScoreByUser.length > 0
      ? Math.round((sum(totalScoreByUser) / totalScoreByUser.length) * 10) / 10
      : 0;

  const problemAgg = problems?.map((p) => {
    const subs = submissions.filter((s) => s.problem_id === p.problemId);
    const usersAttempted = uniq(subs.map((s) => s.user_id)).length;
    const accepted = subs.filter((s) => s.status === "OK");
    const acceptedCount = accepted.length;
    const usersAccepted = uniq(accepted.map(ac=>ac.user_id)).length;
    const totalSubs = subs.length;
    const accuracy = totalSubs ? Math.round((acceptedCount / totalSubs) * 100) : 0;

    const avgScore = (() => {
      const scores = scoresPerUser
        .filter((x) => x.problem_id === p.problemId)
        .map((x) => x.best_score);
      return scores.length ? Math.round((sum(scores) / scores.length) * 10) / 10 : 0;
    })();

    return {
      problemId: p.problemId,
      title: p.title,
      usersAttempted,
      usersAccepted,
      accepted,
      totalSubs,
      accuracy,
      avgScore,
    };
  });

  const langCounts = submissions.reduce((acc, s) => {
    acc[s.language] = (acc[s.language] || 0) + 1;
    return acc;
  }, {});
  const languagePie = Object.entries(langCounts).map(([name, value]) => ({ name, value }));

  const totals = uniq(scoresPerUser.map((x) => x.user_id)).map((uid) => ({
    user_id: uid,
    total: sum(scoresPerUser.filter((x) => x.user_id === uid).map((x) => x.best_score)),
  }));

  const ranges = [
    { label: "0-50", min: 0, max: 50 },
    { label: "51-100", min: 51, max: 100 },
    { label: "101-150", min: 101, max: 150 },
    { label: "151-200", min: 151, max: 200 },
    { label: "201-300", min: 201, max: 300 },
    { label: "301+", min: 301, max: Infinity },
  ];
  const histo = ranges.map((r) => ({
    range: r.label,
    users: totals.filter((t) => t.total >= r.min && t.total <= r.max).length,
  }));

  const totalAC = submissions.filter((s) => s.status === "OK").length;
  const overallAccuracy = submissions.length ? Math.round((totalAC / submissions.length) * 100) : 0;

  return {
    totalRegistered,
    totalAttempted,
    averageScoreOverall,
    problemAgg,
    languagePie,
    histo,
    overallAccuracy,
  };
}

const fmt = new Intl.NumberFormat();

const Box = ({ title, value, suffix }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:bg-slate-800 dark:border-slate-600">
    <div className="text-xs text-slate-500 font-medium dark:text-slate-300">{title}</div>
    <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
      {fmt.format(value)}{suffix ? <span className="text-slate-400 text-xl ml-1">{suffix}</span> : null}
    </div>
  </div>
);

const Panel = ({ title, subtitle, children, className = "" }) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-4 dark:bg-slate-800 dark:border-slate-600 ${className}`}>
    <div className="flex items-end justify-between mb-3">
      <div>
        <h3 className="text-slate-900 font-semibold dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-slate-500 text-sm dark:text-slate-400">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur rounded-lg border border-slate-200 p-2 text-xs">
        <div className="font-semibold text-slate-700 mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-700">{p.name}:</span>
            <span className="text-slate-600">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ContestAnalysisDashboard({problems, submissions, registrations, userProblemScores}) {
  const [query, setQuery] = useState("");
  const { totalRegistered, totalAttempted, averageScoreOverall, problemAgg, languagePie, histo, overallAccuracy } =
    useComputedStats(problems, submissions, registrations, userProblemScores);

  // Pie chart colors 
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <div className="min-h-screen w-full p-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Contest Analysis</h1>
            <p className="text-slate-500 mt-1">Insightful metrics for admins and coaches.</p>
          </div>
        </header>

        {/* Metrics Row */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Box title="Registered" value={totalRegistered} />
          <Box title="Attempted" value={totalAttempted} />
          <Box title="Overall Accuracy" value={overallAccuracy} suffix="%" />
          <Box title="Avg. Score (Attempted)" value={averageScoreOverall} />
        </div>

        {/* Problem-wise Statistics Table */}
        <Panel title="Problem-wise Statistics" subtitle={`${problemAgg.length} problems`}>
        <div className="overflow-x-auto border dark:border-slate-600 rounded-md">
            <table className="min-w-full text-sm border-collapse">
            <thead className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100">
                <tr>
                <th className="px-4 py-2 text-left">Problem</th>
                <th className="px-4 py-2">Users Attempted</th>
                <th className="px-4 py-2">Users Accepted</th>
                <th className="px-4 py-2">Submissions</th>
                <th className="px-4 py-2">Accuracy</th>
                <th className="px-4 py-2">Avg Score</th>
                </tr>
            </thead>
            <tbody>
                {problemAgg.map((row, idx) => (
                <tr
                    key={row.problemId}
                    className={`${
                    idx % 2 === 0
                        ? "bg-slate-50 dark:bg-slate-900"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                >
                    <td className="px-4 py-2 font-medium">{row.title}</td>
                    <td className="px-4 py-2 text-center">{row.usersAttempted}</td>
                    <td className="px-4 py-2 text-center text-green-600">{row.usersAccepted}</td>
                    <td className="px-4 py-2 text-center">{row.totalSubs}</td>
                    <td className="px-4 py-2 text-center">{row.accuracy}%</td>
                    <td className="px-4 py-2 text-center">{row.avgScore}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </Panel>

        {/* Score Distribution Histogram */}
        <Panel title="Score Distribution" subtitle="Users across score ranges" className="mt-6">
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="users" name="# Users" fill="#8884d8" />
            </BarChart>
            </ResponsiveContainer>
        </div>
        </Panel>

        {/* Language Pie */}
        <div className="my-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel title="Language Usage" subtitle={`by ${submissions.length} submissions`}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={languagePie} dataKey="value" nameKey="name" outerRadius={92} 
                    label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                        }
                    >
                    {languagePie.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">© {new Date().getFullYear()} OJ Analytics</footer>
      </div>
    </div>
  );
}

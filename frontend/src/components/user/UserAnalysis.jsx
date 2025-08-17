import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend, ResponsiveContainer } from "recharts";
import { GetDashBoard } from "../../api/problemApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UserDashboard = () => {

  const [submissions, setSubmissions] = useState([]);
  const [userProblemScore, setUserProblemScore] = useState([]);

  const isDark = useSelector((state) => state.theme.theme);


    useEffect(()=>{
      const fetchDashboardData = async () =>{
          try {
              const res = await GetDashBoard();
              if (res?.success){
                  setSubmissions(res?.submissions);
                  setUserProblemScore(res?.userProblemsScore);
              }else{
                  handleError(res?.message || "Error loading data")
              }
          } catch (error) {
              handleError(error?.message || "Error loading data")
          }
      }

      fetchDashboardData();
    }, [])

      const handleError = (err) =>
        toast.error(err, {
            position: "bottom-left",
        });
    
      const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "bottom-right",
      });
  // 1️⃣ Basic Stats
      // Single-pass calculations
    let totalSubmissions = 0;
    let acceptedSubmissions = 0;
    let langCounts = {};
    let groupedByDate = {};
    let categoryCounts = {};

    submissions.forEach(s => {
      totalSubmissions++;
      if (s.score === 100) acceptedSubmissions++;

      // Language counts
      langCounts[s.language] = (langCounts[s.language] || 0) + 1;

      // Group by date
      const date = new Date(s.submitted_at).toLocaleDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = { totalSubmissions: 0, okSubmissions: 0 };
      }
      groupedByDate[date].totalSubmissions++;
      if (s.score === 100) groupedByDate[date].okSubmissions++;

      // Category counts
      const category = s?.difficulty || "Unknown";
      if (!categoryCounts[category]) {
        categoryCounts[category] = { nonAccepted: 0, accepted: 0 };
      }
      if (s.score === 100) {
        categoryCounts[category].accepted++;
      } else {
        categoryCounts[category].nonAccepted++;
      }
    });

    // Convert grouped results to arrays
    const submissionTrend = Object.entries(groupedByDate).map(([date, stats]) => ({
      date,
      ...stats
    }));
    const maxSubmissionsPerDay = Math.max(...submissionTrend.map(d => d.totalSubmissions));

    const languageData = Object.entries(langCounts).map(([name, value]) => ({ name, value }));

    const categoryData = Object.entries(categoryCounts).map(([category, { nonAccepted, accepted }]) => ({
      category,
      nonAcceptedSubmissions: nonAccepted,
      acceptedSubmissions: accepted
    }));

    // ---- userProblemScore calculations ----
    let solvedProblems = 0;
    let totalScore = 0;
    let scoreGroupedByDate = {};

    userProblemScore.forEach(p => {
      if (p.best_score === 100) solvedProblems++;
      totalScore += p.best_score;

      const date = new Date(p.updatedAt).toLocaleDateString();
      if (!scoreGroupedByDate[date]) {
        scoreGroupedByDate[date] = { score: 0 };
      }
      scoreGroupedByDate[date].score += p.best_score;
    });

    const TotalScoreTrend = Object.entries(scoreGroupedByDate).map(([date, stats]) => ({
      date,
      ...stats
    }));

    // Final computed values
    const solvingAccuracy = ((acceptedSubmissions * 100) / totalSubmissions).toFixed(1);
    totalScore = totalScore.toFixed(1);

  // 7️⃣ Problem-solving efficiency
//   const efficiencyData = userProblemScore.map(ups => {
//     const attempts = submissions.filter(s => s.problem_id === ups.problem_id).length;
//     return {
//       problem: problems.find(p => p.problem_id === ups.problem_id)?.title || "Unknown",
//       efficiency: ((ups.best_score / 100) * 100).toFixed(1),
//       attempts
//     };
//   });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
      <div className="p-2 sm:p-6 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="font-bold text-3xl text-gray-900 dark:text-gray-100">
          📊 My Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your performance insights at a glance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl hover:shadow-md transition">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Submissions
          </h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalSubmissions}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl hover:shadow-md transition">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Problems Solved
          </h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {solvedProblems}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl hover:shadow-md transition">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Score
          </h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {totalScore}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl hover:shadow-md transition">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Solving Accuracy
          </h2>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {solvingAccuracy}%
          </p>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            📈 Submission Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={submissionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="currentColor" tick={{ fill: isDark === 'dark' ? "#e5e7eb" : "#374151" }}/>
              <YAxis
                domain={[0, maxSubmissionsPerDay + 1]}
                allowDecimals={false}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="okSubmissions"
                strokeWidth={2}
                stroke="#00c853"
                name="Accepted"
              />
              <Line
                type="monotone"
                dataKey="totalSubmissions"
                stroke="#8884d8"
                name="Total"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            ⭐ Score Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={TotalScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="currentColor" tick={{ fill: isDark === 'dark' ? "#e5e7eb" : "#374151" }}/>
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ff9800"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            💻 Language Usage
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            📂 Category-wise Submissions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke="currentColor" tick={{ fill: isDark === 'dark' ? "#e5e7eb" : "#374151" }}/>
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="acceptedSubmissions"
                stackId="a"
                fill="#4caf50"
                name="Accepted"
              />
              <Bar
                dataKey="nonAcceptedSubmissions"
                stackId="a"
                fill="#f44336"
                name="Failed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    
      {/* Problem Solving Efficiency */}
      {/* <div className="bg-white shadow p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">Problem Solving Efficiency</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="problem" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="efficiency" fill="#8884d8" name="Best Score %" />
            <Bar dataKey="attempts" fill="#FF8042" name="Attempts" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}
      </div>
  );
};

export default UserDashboard;

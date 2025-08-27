import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { getAdminDashboardStats } from "../../api/problemApi";
import { handleError } from "../../utils/toastFunctions";

// Pie chart colors 
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", ];

export default function AdminDashboard() {

    const [submissionsTrendData, setSubmissionsTrendData] = useState([]);
    const [languageData, setLanguageData] = useState([]);
    const [difficultyData, setDifficultyData] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProblems: 0,
        totalSubmissions: 0,
        acceptedSubmissions: 0,
    });

    useEffect(() => {
        const fetchAdminStats = async () => {
          try {
            const res = await getAdminDashboardStats();
            if (res?.success) {
              setSubmissionsTrendData(res?.submissionsTrendData);
              setLanguageData(res?.languageData);
              setDifficultyData(res?.difficultyData);
              setStats({
                totalProblems:res?.totalProblems,
                totalUsers:res?.totalUsers,
                totalSubmissions:res?.totalSubmissions,
                acceptedSubmissions:res?.acceptedSubmissions
              })
            } else {
              handleError(res?.message || "Error loading leaderboard");
            }
          } catch (error) {
            handleError(error?.message || "Error loading leaderboard");
          }
        };
    
        fetchAdminStats();
      }, []);

  return (
    <div className="p-4 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-full">
      {/* Top Row - Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl shadow bg-gray-100 dark:bg-gray-800">
          <h3 className="text-sm font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{stats?.totalUsers}</p>
        </div>
        <div className="p-4 rounded-2xl shadow bg-gray-100 dark:bg-gray-800">
          <h3 className="text-sm font-semibold">Total Problems</h3>
          <p className="text-2xl font-bold">{stats?.totalProblems}</p>
        </div>
        <div className="p-4 rounded-2xl shadow bg-gray-100 dark:bg-gray-800">
          <h3 className="text-sm font-semibold">Total Submissions</h3>
          <p className="text-2xl font-bold">{stats?.totalSubmissions}</p>
        </div>
        <div className="p-4 rounded-2xl shadow bg-gray-100 dark:bg-gray-800">
          <h3 className="text-sm font-semibold">Accepted Solutions</h3>
          <p className="text-2xl font-bold">{stats?.acceptedSubmissions}</p>
        </div>
      </div>

      {/* Middle Row - Charts */}
      <div className="grid grid-cols-1 xl:lg:grid-cols-3 lg:grid-cols-2 gap-6">
        {/* Submissions Trend */}
        <div className="p-4 rounded-2xl shadow bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Submissions Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={submissionsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
              <Line type="monotone" dataKey="accepted" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Language Used */}
        <div className="p-4 rounded-2xl shadow bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Languages Used</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty-wise Submissions */}
        <div className="p-4 rounded-2xl shadow bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2">Difficulty-wise Submissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="difficulty" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="accepted" stackId="a" fill="#82ca9d" />
              <Bar dataKey="wrong" stackId="a" fill="#ff7f7f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

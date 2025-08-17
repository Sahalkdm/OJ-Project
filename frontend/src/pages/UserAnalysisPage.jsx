import React from 'react'
import UserDashboard from '../components/user/UserAnalysis'

const data = {
  "submissions": [
    {
      "user_id": 1,
      "problem_id": 101,
      "language": "Python",
      "status": "OK",
      "score": 100,
      "verdict": "Accepted",
      "submitted_at": "2025-08-01T10:15:00Z"
    },
    {
      "user_id": 1,
      "problem_id": 101,
      "language": "Python",
      "status": "Partial",
      "score": 70,
      "verdict": "Partial Correct",
      "submitted_at": "2025-08-02T12:40:00Z"
    },
    {
      "user_id": 1,
      "problem_id": 102,
      "language": "C++",
      "status": "OK",
      "score": 100,
      "verdict": "Accepted",
      "submitted_at": "2025-08-02T15:20:00Z"
    },
    {
      "user_id": 1,
      "problem_id": 103,
      "language": "Java",
      "status": "Wrong Answer",
      "score": 0,
      "verdict": "WA",
      "submitted_at": "2025-08-03T11:00:00Z"
    }
  ],
  "userProblemScore": [
    { "problem_id": 101, "user_id": 1, "best_score": 100, "updatedAt": "2025-08-01T10:15:00Z" },
    { "problem_id": 102, "user_id": 1, "best_score": 100, "updatedAt": "2025-08-02T10:15:00Z" },
    { "problem_id": 103, "user_id": 1, "best_score": 50, "updatedAt": "2025-08-02T10:15:00Z" },
  ],
  "problems": [
    { "problem_id": 101, "title": "Array Sum", "category": "Easy" },
    { "problem_id": 102, "title": "Graph Paths", "category": "Medium" },
    { "problem_id": 103, "title": "String Matching", "category": "Hard" }
  ]
}

function UserAnalysisPage() {
  return (
    <div>
      <UserDashboard submissions={data.submissions} problems={data?.problems} userProblemScore={data?.userProblemScore}/>
    </div>
  )
}

export default UserAnalysisPage

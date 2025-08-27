import React, { useEffect, useState } from 'react'
import LeaderBoardTable from '../components/problem/LeaderBoardTable'
import { GetLeaderboardInfo } from '../api/problemApi';
import { handleError } from '../utils/toastFunctions';

function LeaderBoard() {

  const [leaderboard, setLeaderboard] = useState([]);

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

  return (
    <div>
      <div className="p-3">
        <LeaderBoardTable leaderboard={leaderboard}/>
      </div>
    </div>
  )
}

export default LeaderBoard

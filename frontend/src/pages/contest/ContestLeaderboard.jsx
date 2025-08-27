import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom';
import LeaderBoardTable from '../../components/problem/LeaderBoardTable';

function ContestLeaderboard() {

  const { contestData, fetchSectionData } = useOutletContext();
  
  useEffect(() => {
    if (!contestData?.leaderboard) {
      fetchSectionData("leaderboard");
    }
  }, [contestData?.leaderboard, fetchSectionData]);

  if (!contestData?.leaderboard) {
    return <div className="flex justify-center items-center h-40">Loading...</div>;
  }
  return (
    <div>
      {contestData?.leaderboard?.length > 0 
        ? <LeaderBoardTable leaderboard={contestData.leaderboard} perPage={25}/>
      : <div className="flex justify-center items-center h-40">No data avialable</div>}
    </div>
  )
}

export default ContestLeaderboard

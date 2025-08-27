import React, { useEffect } from 'react'
import ProblemDisplay from '../../components/problem/ProblemDisplay'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

function ContestCodingPage() {
   const {contestNow:latestContest, userStatusNow:userStatus, joinTimeNow:joinTime, updateScoreStatus }  = useOutletContext()
   const {contestId} = useParams();
   const navigate = useNavigate();
   useEffect(()=>{
    const now = Date.now();
    const ending = new Date(latestContest?.end_time).getTime();
    if (userStatus != "Started" || (ending && now > ending)) navigate(`/contest/${contestId}`)
   }, [latestContest, userStatus]);
    
  return (
    <div className='h-full'>
      <ProblemDisplay isContest={true} contest={latestContest} joinTime={joinTime} handleUpdateScoreStatus={updateScoreStatus}/>
    </div>
  )
}

export default ContestCodingPage

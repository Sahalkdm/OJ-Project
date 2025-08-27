import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setContest, setUserStatus } from '../../store/contestSlice';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { getContestById, getContestLeaderboard, getProblemsContest, getUserContestStatus, startContest } from '../../api/contestApi';
import LoadingPage from '../LoadingPage';
import { handleError } from '../../utils/toastFunctions';
import Navbar from '../../components/Navbar';

function ContestConductionLayout() {
    const {latestContest, loading:loadingContest } = useSelector(state => state.contest);
    const {contestId} = useParams();

    const [loading, setLoading] = useState(false);
    const [problems, setProblems] = useState([]);
    const [leaderboard, setLeaderboard] = useState(null);
    const [contestNow, setContestNow] = useState(null);
    const [userStatusNow, setUserStatusNow] = useState(null);
    const [joinTimeNow, setJoinTimeNow] = useState(null);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const now = Date.now();

    const GetContest = async () => {
        try {
            const res = await getContestById(contestId);
            if (res.success){
                setContestNow(res?.contest);
                navigatePage(res.contest?.start_time);
                if (now <= new Date(res.contest?.end_time).getTime()){
                  useDispatch(setContest(res.contest));
                }
            }else{
                handleError(res.message);
            }
        } catch (error) {
            handleError(error.message || "Something went wrong, try refresh page!")
        }
    }
    
    const handleStartContest = async () => {
        try {
          const res = await startContest(contestId);
          if (res.success){
            if (contestNow && now <= new Date(contestNow.end_time).getTime()){
              dispatch(setUserStatus({status:res.status, joinTime:res.joinTime}));
            }
            setJoinTimeNow(res?.joinTime);
            setUserStatusNow(res?.status);
          }else{
            handleError(res.message);
          }
        } catch (error) {
          handleError(error?.message || "Please try again later!")
        }
    }

    const getUserStatus = async () => {
        try {
          const res = await getUserContestStatus(contestId);
          if (res.success){
            if (res.status==="Registered"){
                handleStartContest();
            }else{
              if (contestNow && now <= new Date(contestNow.end_time).getTime()){
                dispatch(setUserStatus({status:res.status, joinTime:res.joinTime}));
              }
              setJoinTimeNow(res?.joinTime);
              setUserStatusNow(res?.status);
            }
          }else{
            handleError(res.message);
          }
        } catch (error) {
          handleError(error?.message || "Please try again later!");
        }
    }

    useEffect(()=>{
      const fetchData = async () =>{
        setLoading(true);
        if (!contestNow){
          await GetContest();
        }
        if (!(userStatusNow && joinTimeNow)){
            await getUserStatus();
        }
        if (problems?.length === 0){
          await fetchProblems();
        }
        if (!leaderboard){
          await fetchLeaderboard();
        }
        setLoading(false);
      }
      fetchData();
    },[contestId]);

    const fetchProblems = async () => {
      try {
          const res = await getProblemsContest(contestId);
          if (res.success){
              setProblems(res.contest.problems);
          }else{
              handleError(res.message);
          }
      } catch (error) {
          handleError(error.message || "Error loading problems, Try refresh")
      }
    }

    const fetchLeaderboard = async () => {
      try {
          const res = await getContestLeaderboard(contestId);
          if (res.success){
              setLeaderboard(res.leaderboard);
          }else{
              handleError(res.message);
          }
      } catch (error) {
          handleError(error.message || "Error loading leaderboard, Try refresh")
      }
    }

    const navigatePage = (start) => {
      if (!start) return;
      const startTime = new Date(start).getTime();
      if (startTime > now) {
        navigate('/contests');
      }
    }

    const updateScoreStatus = (problem_id, score) => {
      console.log(problem_id, score);
      setProblems(prevProblems =>
        prevProblems.map(p => {
          if (p.problemId === problem_id) {
            // Update bestScore only if new score is greater
            const newBestScore = Math.max(p.bestScore || 0, score*p.maxScore/100);

            return {
              ...p,
              bestScore: newBestScore,
              status: newBestScore === p.maxScore ? "Accepted" : "Attempted"
            };
          }
          return p;
        })
      );
    };

    if (loadingContest || loading) return <LoadingPage/>

  return (
    <div className={`h-screen flex flex-col dark:bg-gradient-to-b from-gray-950 via-gray-900 to-black`}>
      {now > new Date(contestNow?.end_time).getTime() && <Navbar/>}
      <div className='flex-grow overflow-auto'>
        <Outlet context={{ problems, contestNow, userStatusNow, joinTimeNow, leaderboard, setUserStatusNow, updateScoreStatus }}/>
      </div>
    </div>
  )
}

export default ContestConductionLayout

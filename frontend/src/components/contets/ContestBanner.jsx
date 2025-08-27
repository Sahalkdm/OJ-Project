import { useEffect, useState } from "react";
import { registerForContest, startContest } from "../../api/contestApi";
import { handleError, handleSuccess } from "../../utils/toastFunctions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addRegistration, setUserStatus } from "../../store/contestSlice";

export default function ContestBanner({isButtonVisible=true, avlContest=null}) {
    const {user} = useSelector(state=> state?.auth); 
    const {latestContest} = useSelector(state=> state?.contest); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState("upcoming"); // upcoming | running | ended
  const [loading, setLoading] = useState(false);

  // Derived contest, no local state needed
  const contest = avlContest || latestContest;

  useEffect(() => {
    if (contest){
        const interval = setInterval(() => {
        const now = new Date();
        const start = new Date(contest.start_time);
        const end = new Date(contest.end_time);

        if (now < start) {
            setStatus("upcoming");
            const diff = start - now;
            setTimeLeft(formatTime(diff));
        } else if (now >= start && now <= end) {
            setStatus("running");
            const diff = end - now;
            setTimeLeft(formatTime(diff));
        } else {
            setStatus("ended");
            setTimeLeft("00:00:00");
        }
        }, 1000);

        return () => clearInterval(interval);
    }
  }, [contest]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);

    const d = String(Math.floor(totalSeconds / (3600 * 24))).padStart(2, "0"); 
    const h = String(Math.floor((totalSeconds % (3600 * 24)) / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    let str
    if (parseInt(d) > 0){
        str = `${d}d ${h}:${m}:${s}`;
    }else{
        str = `${h}:${m}:${s}`;
    }
    return str;
  };

  const handleRegisterForContest = async () =>{
    setLoading(true);
    if (user){
        try {
            const res = await registerForContest(contest?._id);
            if (res.success) {
                handleSuccess(res.message);
                dispatch(addRegistration());
            }
            else handleError(res.message);
        } catch (error) {
            handleError(error?.message || "Error registering contest")
        }
    }else{
        navigate('/login');
    }
    setLoading(false);
  }

  const handleStartContest = async () => {
    setLoading(true)
    try {
      const res = await startContest(contest?._id);
      if (res.success){
        dispatch(setUserStatus({status:res.status, joinTime:res.joinTime}));
        navigate(`/contest/${contest?._id}`)
      }else{
        handleError(res.message);
      }
    } catch (error) {
      handleError(error?.message || "Please try again later!")
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
      {/* Left Side - Contest Info */}
      {contest ? <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold">{contest.title}</h2>
        <p className="mt-2 text-lg opacity-90">{contest.description}</p>
        <p className="mt-1 text-sm opacity-75">{contest.rules}</p>

        <div className="mt-4 text-2xl font-mono">
          {status === "upcoming" && <>Starts in: {timeLeft}</>}
          {status === "running" && <>Ends in: {timeLeft} <p className="text-xs text-gray-400">*This is the contest end time, not your remaining time.</p></>}
          {status === "ended" && <>Contest Ended</>}
        </div>

        {isButtonVisible && <div className="mt-6">
          {status === "upcoming" && (contest?.isRegistered ? (
            <button disabled className="px-6 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow hover:bg-gray-100 transition">
              Registered
            </button>
          ):<button disabled={loading} onClick={handleRegisterForContest} className="px-6 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow hover:bg-gray-100 transition">
              Register
            </button>)}
          {status === "running" && (
            <button disabled={loading} onClick={handleStartContest} className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition">
              Start Contest
            </button>
          )}
          {status === "ended" && (
            <button className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold shadow cursor-not-allowed">
              Contest Ended
            </button>
          )}
        </div>}
      </div>: <div>No Upcoming Contest</div>}

      {/* Right Side - Illustration */}
      <div className="">
        <img
          src="/contest_image_oj.png"
          alt="Contest Illustration"
          className="w-56 drop-shadow-2xl"
        />
      </div>
    </div>
  );
}

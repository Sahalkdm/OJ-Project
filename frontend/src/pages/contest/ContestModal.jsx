import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { registerForContest } from "../../api/contestApi";
import { useSelector } from "react-redux";
import { handleError, handleSuccess } from "../../utils/toastFunctions";

export default function Banner() {
    const {latestContest} = useSelector(state=>state.contest);
    const {user} = useSelector(state=>state.auth);

    const [isOpen, setIsOpen] = useState(false);

  // Open modal automatically on page load
  useEffect(() => {
    if (!latestContest?.isRegistered){
      setIsOpen(true);
    }
  }, []);

  const handleRegisterForContest = async () =>{
      if (user){
          try {
              const res = await registerForContest(latestContest?._id);
              if (res.success) {
                handleSuccess(res.message);
                setIsOpen(false);
              }
              else {handleError(res.message)};
          } catch (error) {
              handleError(error?.message || "Error registering contest")
          }
      }else{
          navigate('/login');
      }
    }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center bg-black/50 overflow-auto p-3">
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white max-w-4xl rounded-lg">
        {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Practice Coding, Compete in Contests, <br />
            <span className="text-yellow-300">Sharpen Your Skills!</span>
          </h1>
          <p className="text-lg text-gray-100 max-w-xl">
            Join thousands of learners, solve coding problems, and take part in 
            exciting contests to test your skills. Level up step by step!
          </p>
          <div>
            <Link
              to="/contests"
              className="px-6 py-3 bg-yellow-400 text-blue-900 font-semibold rounded-xl shadow-md hover:bg-yellow-300 transition"
            >
              Explore Contests
            </Link>
          </div>
        </div>

        {/* Right Side: Contest Card */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="rounded-2xl shadow-lg border-1 w-full max-w-md overflow-hidden">
                <img
                  src="contest_image_oj.png"
                  alt="Contest Image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 space-y-3 text-center">
                  <h3 className="text-xl font-bold text-white">
                    🔥 August Coding Challenge
                  </h3>
                  <p className="text-gray-200 text-sm">
                    Starts: <span className="font-medium">25th Aug, 6:00 PM</span>
                    <br />
                    Duration: <span className="font-medium">2 Hours</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Solve tricky problems, climb the leaderboard, and win
                    exciting rewards!
                  </p>
                  <button onClick={handleRegisterForContest} className="px-3 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
      </div>
    </section>
    </div>
  );
}


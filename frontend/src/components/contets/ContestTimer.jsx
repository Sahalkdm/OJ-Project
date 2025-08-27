import React, { useState, useEffect } from "react";
import { MdAccessTime } from "react-icons/md";

const ContestTimer = ({ endTime, duration, startTime, onExit }) => {
  const getRemaining = () => {
    const now = Date.now();
    if (!startTime || !endTime) return 0;
    let remainingDuration;
    if (new Date(endTime).getTime() - new Date(startTime).getTime() > duration*1000){
        remainingDuration = duration * 1000 - (now - new Date(startTime).getTime());
    }else{
        remainingDuration = new Date(endTime).getTime() - now;
    }
    return Math.max(0, remainingDuration);
  };

  const [timeLeft, setTimeLeft] = useState(getRemaining());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!startTime) return;
    //console.log("time left: ", timeLeft);
    if (timeLeft <= 0) {
        setShowModal(true);
        return;
    };

    const interval = setInterval(() => {
        const remaining = getRemaining();
        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          setShowModal(true);
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, duration, startTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
    <div className="bg-gray-800 text-white px-3 py-1 rounded-md font-mono text-center shadow-md flex gap-1 items-center">
      <MdAccessTime className="w-5 h-5"/> {timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}
    </div>

    {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-4">⏰ Time's Up!</h2>
            <p className="mb-4">Your contest has ended.</p>
            <button
              onClick={onExit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Contest Page
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ContestTimer;

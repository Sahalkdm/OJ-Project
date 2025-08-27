import React from 'react'
import { motion } from "framer-motion";
import { IoSparklesOutline, IoTrophyOutline } from "react-icons/io5";
import { PiRocketLaunchBold } from "react-icons/pi";
import { FaCode } from "react-icons/fa";
import { IoAnalyticsOutline } from "react-icons/io5";
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import Banner from './contest/ContestModal';

function Home() {
  return (
     <div className="md:h-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-6 py-3 overflow-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <IoSparklesOutline className="text-yellow-400 w-6 h-6" />
          <span className="uppercase tracking-wide text-sm font-semibold text-gray-400">
            Welcome to
          </span>
          <IoSparklesOutline className="text-yellow-400 w-6 h-6" />
        </div>

        <div className='flex flex-col gap-2'>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent py-3 leading-tight">
            MyCoddy
          </h1>
        
          <p className="text-lg text-gray-300">
            Sharpen your coding skills, challenge your logic, and master competitive programming 
            with <span className="font-semibold text-cyan-400">MyCoddy</span> 🚀
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link to={'/register'}><Button className="flex gap-2 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 shadow-lg hover:from-cyan-400 hover:to-blue-500">
            <PiRocketLaunchBold className="w-6 h-6" /> 
            Get Started
          </Button></Link>
          <Link to={'/problems'}><Button
            variant="default"
            className="flex gap-2 items-center justify-center rounded-2xl 
                      border border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-white 
                      px-6 py-3 font-semibold transition-colors"
          >
            <FaCode className="w-5 h-5" /> 
            Try Problems
          </Button></Link>
        </div>
      </motion.div>

      {/* Floating Cards / Features */}
      <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4">
        {[
          {
            title: "Code Challenges",
            desc: "Solve hundreds of problems and sharpen your skills.",
            icon: <FaCode className="w-8 h-8 text-cyan-400" />,
          },
          {
            title: "Leaderboards",
            desc: "Compete globally and showcase your talent.",
            icon: <PiRocketLaunchBold className="w-8 h-8 text-purple-400" />,
          },
          {
            title: "Analytics",
            desc: "Track your performance with detailed analytics and insights.",
            icon: <IoAnalyticsOutline className="w-8 h-8 text-blue-500" />, 
          },
          // {
          //   title: "Community",
          //   desc: "Join other coders, share solutions, and grow together.",
          //   icon: <IoSparklesOutline className="w-8 h-8 text-yellow-400" />,
          // },
          {
            title: "Contests",
            desc: "Participate in contests, compete with peers, and improve your skills.",
            icon: <IoTrophyOutline className="w-8 h-8 text-green-500" />, 
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * idx }}
            className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-3 mb-3">{card.icon} <h3 className="text-xl font-bold">{card.title}</h3></div>
            <p className="text-gray-400">{card.desc}</p>
          </motion.div>
        ))}
      </div>
      {/* <Banner/> */}
    </div>
  )
}

export default Home

import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestContest } from '../store/contestSlice';

function Layout() {
  const { latestContest } = useSelector(state => state.contest);

  const dispatch = useDispatch();

  useEffect(() => {
      if (!latestContest) {
        dispatch(fetchLatestContest());
      }
    }, [dispatch, latestContest]);

  return (
    <div className={`h-screen flex flex-col dark:bg-gradient-to-b from-gray-900 via-gray-800 to-black`}>
      <Navbar/>
      <div className='flex-grow overflow-auto'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout

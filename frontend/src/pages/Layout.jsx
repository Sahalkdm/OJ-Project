import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'
import { useSelector } from 'react-redux';

function Layout() {
  const theme = useSelector((state) => state.theme.theme) || "light";
  return (
    <div className={`h-screen flex flex-col ${theme==='dark' && 'bg-gradient-to-b from-gray-900 via-gray-800 to-black'}`}>
      <Navbar/>
      <div className='flex-grow overflow-auto'>
        <Outlet/>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Layout

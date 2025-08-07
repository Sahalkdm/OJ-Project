import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ToastContainer } from 'react-toastify'

function Layout() {
  return (
    <div className='h-screen flex flex-col'>
      <Navbar/>
      <div className='flex-grow overflow-auto'>
        <Outlet/>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Layout

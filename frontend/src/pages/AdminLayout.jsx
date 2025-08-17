import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div className='flex h-full'>
      <Sidebar/>
      <div className='h-full overflow-auto w-full'>
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminLayout

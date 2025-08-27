import React, { useState } from 'react'
import { BiSolidBookContent } from "react-icons/bi";
import { HiUsers } from "react-icons/hi2";
import { RiFolderAddFill } from "react-icons/ri";
import { FaPowerOff } from "react-icons/fa6";
import { LuFiles } from "react-icons/lu";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidFolderPlus } from "react-icons/bi";
import { Link, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { RiFunctionAddFill } from "react-icons/ri";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { HiViewGrid } from "react-icons/hi";

function Sidebar() {

    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
    { icon: <BiSolidBookContent />, label: "Dashboard", link: "/admin", end:true },
    { icon: <HiUsers />, label: "Users", link:"/admin/users", end:true },
    { icon: <RiFolderAddFill/>, label: "Add Question", link: "/admin/add-problem", end:true },
    { icon: <BsDatabaseFillAdd/>, label: "Add Tags", link: "/admin/add-tag", end:true },
    { icon: <LuFiles/>, label: "Submissions", link:"/admin/submissions", end:true },
    { icon: <RiFunctionAddFill/>, label: "Add Contest", link:"/admin/manage-contest", end:true },
    { icon: <HiViewGrid/>, label: "View Contests", link:"/admin/contests", end:false },
    { icon: <FaUserCircle/>, label: "Profile", link:"/admin/profile", end:true },
  ];

    function handleLogout(){
      dispatch(logout());
    }

  return (
    <div className={`relative bg-gray-800 dark:bg-gray-800 text-white h-full p-2 transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-64"}`}>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 bg-gray-800 rounded-full px-1 py-2 hover:bg-gray-700 shadow"
        >
          {collapsed ? '>' : '<'}
        </button>

      <div className='px-2 flex flex-col gap-2'>

        {menuItems.map((item, index)=>(
             <NavLink to={item?.link} end={item?.end} key={index} className={({isActive})=>'flex gap-3 text-lg items-center h-10 hover:bg-gray-600 py-1 rounded-md px-2 '+(isActive ? 'bg-gray-500 ' : ' ')+(collapsed && 'w-fit')}>
                  {item?.icon}
                  {!collapsed && item?.label}
            </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className={`flex gap-3 text-lg items-center h-10 hover:bg-gray-600 py-1 rounded-md px-2 ${collapsed && 'w-fit'}`}
        >
          <FaPowerOff/>
          {!collapsed && 'Logout'}
        </button>
        
      </div>
    </div>
  )
}

export default Sidebar

import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvides'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { FaMoon, FaSun } from 'react-icons/fa';
import { toggleTheme } from '../store/themeSlice';
import { FaUserCircle } from "react-icons/fa";

function Navbar() {

  // const {user, logout} = useAuth();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user); // from Redux store
  const theme = useSelector(state=>state.theme.theme)

  const [isNavOpen, setIsNavOpen] = useState(false); // mobile menu toggle
  const [isOpen, setIsOpen] = useState(false);
  
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout(){
    dispatch(logout());
    setIsOpen(false);
  }
  
  return (
    <nav className="border-gray-200 bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 relative">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/myCoddyLogo.png"
            className="h-8"
            alt="MyCoddy"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
          </span>
        </a>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {isNavOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Avatar Menu */}
          {user && (
            <div className="relative block md:hidden" ref={menuRef}>
              <button
                type="button"
                onClick={() => {setIsOpen(!isOpen)}}
                className="flex items-center rounded-full focus:ring-4 focus:ring-gray-600"
              >
                <FaUserCircle className='h-8 w-8 text-gray-200'/>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-gray-700 z-50">
                  <div className="px-4 py-3">
                    <span className="block text-sm font-medium text-white">
                      {user?.firstname} {user?.lastname}
                    </span>
                    <span className="block text-sm truncate text-gray-400">
                      {user?.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <NavLink
                        to="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/settings"
                        className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                      >
                        Settings
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile & Desktop Menu */}
        <div
          className={`w-full md:block md:w-auto ${
            isNavOpen ? "block" : "hidden"
          }`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700">
            <li>
              <NavLink
                to="/"
                className={({isActive})=>`block py-2 px-3 bg-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${isActive ? 'text-blue-500' : 'text-white '}`}
              >
                Home
              </NavLink>
            </li>
            {user?.isAdmin && <li>
              <NavLink
                to="/admin"
                className={({isActive})=>`block py-2 px-3 bg-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${isActive ? 'text-blue-500' : 'text-white '}`}
              >
                Admin Dashboard
              </NavLink>
            </li>}
            <li>
              <NavLink
                to="/problems"
                className={({isActive})=>`block py-2 px-3 bg-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${isActive ? 'text-blue-500' : 'text-white '}`}
              >
                Problems
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/leaderboard"
                className={({isActive})=>`block py-2 px-3 bg-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${isActive ? 'text-blue-500' : 'text-white '}`}
              >
                Leaderboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contests"
                className={({isActive})=>`block py-2 px-3 bg-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${isActive ? 'text-blue-500' : 'text-white '}`}
              >
                Contests
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/services"
                className="block py-2 px-3 bg-gray-900 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="block py-2 px-3 bg-gray-900 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
              >
                Contact
              </NavLink>
            </li> */}
            {user ? (
              <li>
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => {setIsOpen(!isOpen)}}
                className="flex items-center rounded-full focus:ring-4 focus:ring-gray-600"
              >
                <FaUserCircle className='h-8 w-8 text-gray-200'/>
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-gray-700 z-50">
                  <div className="px-4 py-3">
                    <span className="block text-sm font-medium text-white">
                      {user?.firstname} {user?.lastname}
                    </span>
                    <span className="block text-sm truncate text-gray-400">
                      {user?.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <NavLink
                        to="/dashboard"
                        className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/settings"
                        className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                      >
                        Settings
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            </li>)
            :(
              <li>
                <NavLink
                  to="/login"
                  className={({isActive})=>`block py-2 px-3 bg-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 ${isActive ? 'text-blue-500' : 'text-white '}`}
                >
                  Login
                </NavLink>
              </li>
            )}
            <li>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-yellow-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {theme === "dark" ? (
                  <FaSun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FaMoon className="w-5 h-5 text-blue-400" />
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

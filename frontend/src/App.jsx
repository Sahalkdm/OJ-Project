import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import NoPage from './pages/NoPage'
import CodePage from './pages/CodePage'
import ProtectedRoute from './pages/ProtectedRoute'
import AddProblemPage from './pages/AddProblemPage'
import ProblemList from './pages/ProblemList'
import AddTestCases from './pages/AddTestCases'
import AdminRoute from './pages/AdminRoute'
import LeaderBoard from './pages/LeaderBoard'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchUser } from './store/authSlice'
import UserAnalysisPage from './pages/UserAnalysisPage'
import AdminLayout from './pages/AdminLayout'
import Users from './pages/Users'
import Submissions from './pages/Submissions'
import AdminDashboard from './pages/AdminDashboard'

function App() {

  const user = useSelector(state => state.auth?.user);
  const theme = useSelector((state) => state.theme.theme); // light | dark

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={user ? <Home/> : <Login/>}/>
          <Route element = {<AdminRoute/>}>
            <Route path='/admin/' element={<AdminLayout/>}>
              <Route index element={<AdminDashboard/>}/>
              <Route path='add-problem' element={<AddProblemPage/>}/>
              <Route path='users' element={<Users/>}/>
              <Route path='submissions' element={<Submissions/>}/>
              <Route path='add-problem/:problem_id' element={<AddProblemPage/>}/>
              <Route path='add-testcases/:problem_id' element={<AddTestCases/>}/>
              <Route path="*" element={<NoPage />} />
            </Route>
          </Route>
          <Route path='problems' element={<ProblemList/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/problem/:problem_id' element={<CodePage/>}/>
            <Route path='/leaderboard' element={<LeaderBoard/>}/>
            <Route path='/dashboard' element={<UserAnalysisPage/>}/>
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

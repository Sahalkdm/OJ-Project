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
import AddTagForm from './pages/AddTag'
import { fetchTags } from './store/tagsSlice'
import LoadingPage from './pages/LoadingPage'
import AddContest from './pages/contest/AddContest'
import ContestLayout from './pages/contest/ContestLayout'
import ContestInfo from './pages/contest/ContestInfo'
import ContestLeaderboard from './pages/contest/ContestLeaderboard'
import ContestAnalytics from './pages/contest/ContestAnalytics'
import ContestRegistrations from './pages/contest/ContestRegistrations'
import QuestionMapping from './pages/contest/QuestionMapping'
import ContestTable from './pages/contest/ContestsTable'
import ContestPage from './pages/contest/ContestDisplay'
import ContestCodingPage from './pages/contest/ContestCodingPage'
import ContestConductionLayout from './pages/contest/ContestConductionLayout'
import ContestSubmissions from './pages/contest/ContestSubmissions'
import { ToastContainer } from 'react-toastify'

function App() {

  const {user, loading} = useSelector(state => state.auth);
  const theme = useSelector((state) => state.theme.theme); // light | dark
  //const {latestContest, loading:loadingContest} = useSelector(state => state.contest);

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

  useEffect(() => {
      dispatch(fetchTags());
  }, [dispatch]);

  if (loading) return <LoadingPage/>;

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
              <Route path='add-tag' element={<AddTagForm/>}/>
              <Route path='submissions' element={<Submissions/>}/>
              <Route path='add-problem/:problem_id' element={<AddProblemPage/>}/>
              <Route path='add-testcases/:problem_id' element={<AddTestCases/>}/>
              <Route path='manage-contest' element={<AddContest/>}/>
              <Route path='manage-contest/:id' element={<AddContest/>}/>
              <Route path='contests' element={<ContestTable/>}/>
              <Route path="*" element={<NoPage />} />
              <Route path="contests/:contestId/" element={<ContestLayout />}>
                <Route index element={<ContestInfo />} />
                <Route path="leaderboard" element={<ContestLeaderboard />} />
                <Route path="analysis" element={<ContestAnalytics />} />
                <Route path="registrations" element={<ContestRegistrations />} />
                <Route path="questions" element={<QuestionMapping />} />
                <Route path="submissions" element={<ContestSubmissions />} />
              </Route>
            </Route>
          </Route>
          <Route path='problems' element={<ProblemList/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/problem/:problem_id' element={<CodePage/>}/>
            <Route path='/leaderboard' element={<LeaderBoard/>}/>
            <Route path='/dashboard' element={<UserAnalysisPage/>}/>
            <Route path='/contests' element={<ContestTable/>}/>
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path='contest/:contestId' element={<ContestConductionLayout/>}> 
            <Route index element={<ContestPage/>}/>
            <Route path='problem/:problem_id' element={<ContestCodingPage/>}/>
          </Route>
        </Route>
      </Routes>
       <ToastContainer/>
    </BrowserRouter>
  )
}

export default App

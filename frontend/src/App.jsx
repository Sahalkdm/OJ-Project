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

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
          <Route element = {<AdminRoute/>}>
            <Route path='add-problem' element={<AddProblemPage/>}/>
            <Route path='add-problem/:problem_id' element={<AddProblemPage/>}/>
            <Route path='add-testcases/:problem_id' element={<AddTestCases/>}/>
          </Route>
          <Route path='problems' element={<ProblemList/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/problem/:problem_id' element={<CodePage/>}/>
            <Route path='/leaderboard' element={<LeaderBoard/>}/>
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

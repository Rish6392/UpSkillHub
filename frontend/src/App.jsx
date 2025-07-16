import { useState } from 'react'
// import reactLogo from './Assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Navbar from './components/common/Navbar.jsx'
import OpenRoute from "./components/core/Auth/OpenRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from './pages/ForgotPassword.jsx'

function App() {


  return (
    <div className="min-h-screen w-full bg-richblack-900 flex flex-col font-inter overflow-x-hidden overflow-y-auto">

     <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
         
         <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />


      </Routes>
    </div>
  );
}

export default App

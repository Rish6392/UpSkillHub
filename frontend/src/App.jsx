import { useState } from 'react'
// import reactLogo from './Assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"

function App() {


  return (
    <div className="min-h-screen w-full bg-richblack-900 flex flex-col font-inter overflow-x-hidden overflow-y-auto">


      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App

import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { useState, useRef } from "react"
import { FaBars, FaTimes } from "react-icons/fa"

import Sidebar from "../components/core/Dashboard/Sidebar"
import useOnClickOutside from "../hooks/useOnClickOutside"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef(null)

  // Close sidebar when clicking outside on mobile
  useOnClickOutside(sidebarRef, () => setSidebarOpen(false))

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

 return (
  <div className="relative flex min-h-[calc(100vh-3.5rem)] mt-14">
    {/* Mobile Hamburger Menu Button */}
    <button
      className="md:hidden fixed top-16 left-4 z-[900] bg-richblack-800 text-richblack-25 p-3 rounded-lg border border-richblack-600 shadow-lg hover:bg-richblack-700 transition-colors duration-200"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      {sidebarOpen ? (
        <FaTimes className="text-lg" />
      ) : (
        <FaBars className="text-lg" />
      )}
    </button>

    {/* Mobile Sidebar Overlay with Blur */}
    {sidebarOpen && (
      <div className="fixed inset-0 top-14 bg-black bg-opacity-30 backdrop-blur-sm z-[800] md:hidden" />
    )}

    {/* Sidebar */}
    <div
      ref={sidebarRef}
      className={`
        fixed md:static 
        top-14 md:top-0 left-0 
        h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]
        w-72 md:w-64
        bg-richblack-800 md:bg-richblack-900
        transform transition-transform duration-300 ease-in-out
        z-[850]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        flex-shrink-0
        shadow-2xl md:shadow-none
        border-r border-richblack-600
      `}
    >
      {/* Close button for mobile - positioned inside sidebar */}
      <div className="md:hidden flex justify-end p-4 border-b border-richblack-600">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-richblack-300 hover:text-richblack-100 p-2 rounded-lg hover:bg-richblack-700 transition-colors duration-200"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
      <Sidebar />
    </div>

    {/* Main content */}
    <div className="flex-1 overflow-auto bg-richblack-900 md:ml-0">
      <div className="mx-auto w-full max-w-[1000px] py-4 sm:py-6 lg:py-10 px-3 sm:px-4 lg:px-8 mt-12 md:mt-0">
        <Outlet />
      </div>
    </div>
  </div>
)

}

export default Dashboard
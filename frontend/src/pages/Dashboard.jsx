import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

 return (
  <div className="relative mt-5 flex min-h-[calc(100vh-3.5rem)] flex-col md:flex-row">
    {/* Sidebar with fixed width */}
    <div className="w-64 bg-richblack-900 min-h-full">
      <Sidebar />
    </div>

    {/* Main content with left margin removed (since it's in flex) */}
    <div className="flex-1 overflow-auto bg-richblack-900">
      <div className="mx-auto w-full max-w-[1000px] py-10 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  </div>
)

}

export default Dashboard
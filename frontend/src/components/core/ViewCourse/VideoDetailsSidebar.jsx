import { useEffect, useState } from "react"
import { IoIosArrowBack, IoIosArrowDown } from "react-icons/io"
import { FaRegSquare, FaCheckSquare } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../common/IconBtn"

// CourseSection sub-component for accordion sections
const CourseSection = ({ section, completedVideos, currentVideoId, onVideoSelect, onToggleComplete }) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="course-section">
      <div 
        className="flex flex-row justify-between bg-richblack-600 px-5 py-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-[70%] font-semibold text-richblack-5">
          {section?.sectionName}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-richblack-300">
            {section?.subSection?.length || 0} lecture(s)
          </span>
          <span
            className={`transition-all duration-500 text-richblack-300 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          >
            <IoIosArrowDown />
          </span>
        </div>
      </div>
      
      {isOpen && (
        <div className="transition-[height] duration-500 ease-in-out">
          {section?.subSection?.map((sub) => {
            const isCompleted = completedVideos?.has(sub._id)
            const isActive = currentVideoId === sub._id

            return (
              <div
                key={sub._id}
                className={`flex gap-3 px-5 py-2 cursor-pointer ${
                  isActive
                    ? "bg-yellow-200 font-semibold text-richblack-800"
                    : "hover:bg-richblack-900 text-richblack-300"
                }`}
              >
                <div 
                  className="flex items-center gap-3 w-full"
                  onClick={() => onVideoSelect(sub)}
                >
                  <div 
                    onClick={(e) => { 
                      e.stopPropagation() 
                      onToggleComplete(sub._id) 
                    }}
                    className="text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    {isCompleted ? 
                      <FaCheckSquare className="text-green-500" /> : 
                      <FaRegSquare />
                    }
                  </div>
                  <span className={`${isCompleted ? 'line-through text-richblack-500' : ''}`}>
                    {sub.title}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)
  const { user } = useSelector((state) => state.profile)

  // Convert completedLectures array to Set for easier manipulation
  const [completedVideos, setCompletedVideos] = useState(new Set())
  const [allVideosCompleted, setAllVideosCompleted] = useState(false)
  const [rated, setRated] = useState(false)

  useEffect(() => {
    if (completedLectures) {
      setCompletedVideos(new Set(completedLectures))
    }
  }, [completedLectures])

  useEffect(() => {
    const setActiveFlags = () => {
      if (!courseSectionData?.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection?.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setVideoBarActive(activeSubSectionId)
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
    }
    setActiveFlags()
  }, [courseSectionData, courseEntireData, location.pathname])

  // Check if all videos are completed
  useEffect(() => {
    const totalVideos = courseSectionData?.reduce((acc, section) => {
      return acc + (section?.subSection?.length || 0)
    }, 0) || 0
    setAllVideosCompleted(completedVideos.size === totalVideos && totalVideos > 0)
  }, [completedVideos, courseSectionData])

  // Check if user has already reviewed the course
  const hasUserReviewed = courseEntireData?.ratingAndReviews?.some(
    (review) => review.user?._id === user?._id || review.user === user?._id
  )

  const handleVideoSelect = (video) => {
    navigate(
      `/view-course/${courseEntireData?._id}/section/${video.section}/sub-section/${video._id}`
    )
  }

  const handleToggleComplete = (videoId) => {
    const newCompletedVideos = new Set(completedVideos)
    if (newCompletedVideos.has(videoId)) {
      newCompletedVideos.delete(videoId)
    } else {
      newCompletedVideos.add(videoId)
    }
    setCompletedVideos(newCompletedVideos)
  }

  const handleCourseComplete = (isComplete) => {
    if (isComplete) {
      const allVideoIds = new Set()
      courseSectionData?.forEach(section => {
        section.subSection?.forEach(sub => allVideoIds.add(sub._id))
      })
      setCompletedVideos(allVideoIds)
      setReviewModal(true)
    } else {
      setCompletedVideos(new Set())
    }
  }

  const handleAddReview = () => {
    if (hasUserReviewed || rated) {
      return
    }
    setReviewModal(true)
  }

  const isCourseCompleted = completedVideos?.size === courseSectionData?.reduce((acc, s) => acc + (s.subSection?.length || 0), 0)

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        {/* Sidebar Header */}
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 cursor-pointer"
              title="Back"
            >
              <IoIosArrowBack size={30} />
            </div>
            
            {/* Course completion toggle */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleCourseComplete(!isCourseCompleted)}
            >
              {isCourseCompleted ? 
                <FaCheckSquare className="text-green-500" /> : 
                <FaRegSquare className="text-richblack-300" />
              }
            </div>
          </div>
          
          <div className="flex flex-col w-full">
            <p className="text-richblack-5">{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedVideos?.size || 0} / {totalNoOfLectures}
            </p>
          </div>
          
          {/* Add Review Button */}
          {allVideosCompleted && !hasUserReviewed && !rated && (
            <IconBtn
              text="Add Review"
              customClasses="w-full"
              onclick={handleAddReview}
            />
          )}
        </div>

        {/* Course Content */}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData?.map((course, index) => (
            <CourseSection
              key={course._id}
              section={course}
              completedVideos={completedVideos}
              currentVideoId={subSectionId}
              onVideoSelect={handleVideoSelect}
              onToggleComplete={handleToggleComplete}
            />
          )) || <div className="p-4 text-center text-richblack-5">No course content available</div>}
        </div>
      </div>
    </>
  )
}
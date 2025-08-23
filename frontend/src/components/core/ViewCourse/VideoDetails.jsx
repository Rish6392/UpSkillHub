import React, { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import ReactPlayer from 'react-player'
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"
import { 
    FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress,
    FaFastForward, FaFastBackward, FaCog, FaStickyNote
} from 'react-icons/fa'

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const playerWrapperRef = useRef(null)
  const controlsTimeoutRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Enhanced video player state
  const [playing, setPlaying] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [watchTime, setWatchTime] = useState(0)
  const [notes, setNotes] = useState([])
  const [showNotes, setShowNotes] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [playerInstance, setPlayerInstance] = useState(null)
  const [playerReady, setPlayerReady] = useState(false)
  const [playerFailed, setPlayerFailed] = useState(false)
  const {loading: apiLoading} = useSelector((state) => state.viewCourse)


  useEffect(() => {
    ;(async () => {
      if(apiLoading) return
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        console.log(filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        setVideoData(filteredVideoData[0])
        console.log(filteredVideoData[0] )
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
        loadUserProgress()
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname,apiLoading])

  // Load user progress from localStorage
  const loadUserProgress = () => {
    const progressKey = `course_progress_${courseId}_${user?._id}`
    const savedProgress = localStorage.getItem(progressKey)
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      if (progress.watchTime && progress.lastWatchedVideo === subSectionId) {
        setWatchTime(progress.watchTime)
        setPlayed(progress.played || 0)
      }
    }
  }

  // Save progress to localStorage
  const saveUserProgress = useCallback(() => {
    if (!user?._id || !videoData) return
    
    const progressKey = `course_progress_${courseId}_${user._id}`
    const progress = {
      lastWatchedVideo: subSectionId,
      watchTime: watchTime,
      played: played,
      lastWatchedAt: Date.now()
    }
    localStorage.setItem(progressKey, JSON.stringify(progress))
  }, [courseId, user?._id, videoData, watchTime, played, subSectionId])

  // Auto-save progress
  useEffect(() => {
    const interval = setInterval(saveUserProgress, 10000) // Save every 10 seconds
    return () => clearInterval(interval)
  }, [saveUserProgress])

  // Enhanced video player handlers
  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleRewind = () => {
    if (playerRef.current && duration && playerReady) {
      try {
        const currentTime = played * duration
        const newTime = Math.max(currentTime - 10, 0)
        const newPlayed = newTime / duration
        setPlayed(newPlayed)
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(newPlayed, 'fraction')
        }
      } catch (error) {
        console.warn('Seek operation failed:', error)
      }
    }
  }

  const handleFastForward = () => {
    if (playerRef.current && duration && playerReady) {
      try {
        const currentTime = played * duration
        const newTime = Math.min(currentTime + 10, duration)
        const newPlayed = newTime / duration
        setPlayed(newPlayed)
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(newPlayed, 'fraction')
        }
      } catch (error) {
        console.warn('Seek operation failed:', error)
      }
    }
  }

  const handleProgress = (state) => {
    console.log(state);
    if (!seeking) {
      setPlayed(state.played)
      setLoaded(state.loaded)
      console.log(state.playedSeconds)
      setWatchTime(state.playedSeconds)
      
      // Auto-mark as completed when 90% watched
      if (state.played > 0.9 && videoData && !completedLectures?.includes(subSectionId)) {
        handleLectureCompletion()
        toast.success("Video completed! 🎉")
      }
    }
  }

  const handleTimeUpdate = (state) => {
    if (!seeking) {
      setPlayed(state.played)
      setLoaded(state.loaded)
      setWatchTime(state.playedSeconds)
      
      // Auto-mark as completed when 90% watched
      if (state.played > 0.9 && videoData && !completedLectures?.includes(subSectionId)) {
        handleLectureCompletion()
        toast.success("Video completed! 🎉")
      }
    }
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value))
  }

  const handleSeekMouseUp = (e) => {
    setSeeking(false)
    if (playerRef.current && playerReady) {
      try {
        const seekToValue = parseFloat(e.target.value)
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(seekToValue, 'fraction')
        }
      } catch (error) {
        console.warn('Seek operation failed:', error)
      }
    }
  }

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value))
  }

  const handleToggleMute = () => {
    setMuted(!muted)
  }

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const handleFullscreen = () => {
    if (!fullscreen) {
      if (playerWrapperRef.current?.requestFullscreen) {
        playerWrapperRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setFullscreen(!fullscreen)
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleAddNote = () => {
    if (!newNote.trim() || !videoData) return
    
    const note = {
      id: Date.now(),
      videoId: videoData._id,
      timestamp: (played * duration) || 0,
      content: newNote,
      createdAt: new Date().toISOString()
    }
    
    setNotes(prev => [...prev, note])
    setNewNote('')
    toast.success("Note added!")
  }

  const formatTime = (seconds) => {
    console.log(seconds);
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    }
    return `${mm}:${ss}`
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      
      switch (e.key) {
        case ' ':
          e.preventDefault()
          handlePlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleRewind()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleFastForward()
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(prev => Math.min(prev + 0.1, 1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(prev => Math.max(prev - 0.1, 0))
          break
        case 'f':
          e.preventDefault()
          handleFullscreen()
          break
        case 'm':
          e.preventDefault()
          handleToggleMute()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [playing])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      
      {/* Enhanced Video Player */}
      <div 
        className={`video-player-wrapper relative ${fullscreen ? 'fixed inset-0 z-[5000] bg-black' : 'aspect-video'}`}
        ref={playerWrapperRef}
        onMouseMove={handleMouseMove}
      >
        {!videoData?.video ? (
          <img
            src={previewSource}
            alt="Preview"
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          (ReactPlayer.canPlay(videoData.video) && !playerFailed) ? (
          <ReactPlayer
            key={videoData?.video || 'no-url'}
            ref={playerRef}
            src={videoData?.video}
            playing={playing}
            volume={volume}
            muted={muted}
            playbackRate={playbackRate}
            onTimeUpdate={handleTimeUpdate}
            onProgress={(p) => handleProgress(p)}
            onDuration={(d) => setDuration(d)}
            onEnded={goToNextVideo}
            onReady={() => {
              setPlayerReady(true)
              toast.success("Video ready!")
            }}
            onError={(error) => {
              console.error("Video error:", error)
              setPlayerFailed(true)
              toast.error("Error loading video, trying fallback player")
            }}
            width="100%"
            height="100%"
            controls={false}
            wrapper="div"
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  disablePictureInPicture: true,
                  onContextMenu: (e) => e.preventDefault()
                }
              }
            }}
          />
          ) : (
            <video
              key={(videoData?.video || 'no-url') + '-html5'}
              className="w-full h-full"
              src={videoData?.video}
              controls
              controlsList="nodownload"
              onCanPlay={() => {
                setPlayerReady(true)
              }}
              onError={(e) => {
                console.error('HTML5 video error', e)
                toast.error('Unable to play this video URL')
              }}
            />
          )
        )}
        
        {/* Custom Video Controls */}
        {videoData && (
          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative h-1 bg-gray-600 rounded-full cursor-pointer">
                <div className="absolute h-full bg-gray-400 rounded-full" style={{ width: `${loaded * 100}%` }} />
                <div className="absolute h-full bg-yellow-500 rounded-full" style={{ width: `${played * 100}%` }} />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={played}
                  onMouseDown={handleSeekMouseDown}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={goToPrevVideo} className="text-white hover:text-yellow-500 transition-colors" title="Previous video">
                  <FaFastBackward size={20} />
                </button>
                <button onClick={handleRewind} className="text-white hover:text-yellow-500 transition-colors" title="Rewind 10s">
                  <FaFastBackward size={16} />
                </button>
                <button onClick={handlePlayPause} className="text-white hover:text-yellow-500 transition-colors p-2" title={playing ? "Pause" : "Play"}>
                  {playing ? <FaPause size={24} /> : <FaPlay size={24} />}
                </button>
                <button onClick={handleFastForward} className="text-white hover:text-yellow-500 transition-colors" title="Forward 10s">
                  <FaFastForward size={16} />
                </button>
                <button onClick={goToNextVideo} className="text-white hover:text-yellow-500 transition-colors" title="Next video">
                  <FaFastForward size={20} />
                </button>
                
                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <button onClick={handleToggleMute} className="text-white hover:text-yellow-500 transition-colors" title={muted ? "Unmute" : "Mute"}>
                    {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={muted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-full appearance-none slider"
                  />
                </div>
                
                {/* Time Display */}
                <div className="text-white text-sm">
                  {formatTime(watchTime)} / {formatTime(duration)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowNotes(!showNotes)} 
                  className="text-white hover:text-yellow-500 transition-colors" 
                  title="Notes"
                >
                  <FaStickyNote size={20} />
                </button>
                
                {/* Settings Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowSettings(!showSettings)} 
                    className="text-white hover:text-yellow-500 transition-colors" 
                    title="Settings"
                  >
                    <FaCog size={20} />
                  </button>
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-richblack-800 rounded-lg p-3 min-w-[120px]">
                      <div className="text-white text-sm mb-2">Playback Speed</div>
                      <div className="flex flex-col gap-1">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                          <button
                            key={rate}
                            onClick={() => handlePlaybackRateChange(rate)}
                            className={`text-left px-2 py-1 rounded text-sm transition-colors ${
                              playbackRate === rate ? 'bg-yellow-500 text-black' : 'text-white hover:bg-richblack-700'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button onClick={handleFullscreen} className="text-white hover:text-yellow-500 transition-colors" title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
                  {fullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Debug: quick link to open video URL in new tab (hidden if no URL) */}
        
      </div>

      {/* Video Details Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold">{videoData?.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-richblack-300">
            <span>Duration: {videoData?.timeDuration}</span>
            <span>{Math.round(played * 100)}% completed</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-2">About this lecture</h3>
          <p className="text-richblack-300">{videoData?.description}</p>
        </div>
        
        {/* Notes Section */}
        {showNotes && (
          <div className="bg-richblack-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-4">My Notes</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note at current time..."
                className="flex-1 bg-richblack-700 border border-richblack-600 rounded px-3 py-2 text-white placeholder-richblack-400"
              />
              <button 
                onClick={handleAddNote} 
                className="bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400 transition-colors"
              >
                Add Note
              </button>
            </div>
            <div className="space-y-2">
              {notes
                .filter(note => note.videoId === videoData?._id)
                .map(note => (
                  <div key={note.id} className="bg-richblack-700 p-3 rounded">
                    <div className="text-yellow-500 text-sm font-medium">{formatTime(note.timestamp)}</div>
                    <div className="text-white mt-1">{note.content}</div>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>

      {/* Navigation and Completion Controls */}
      {videoEnded && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-richblack-800 p-6 rounded-lg text-center">
            {!completedLectures?.includes(subSectionId) && (
              <IconBtn
                disabled={loading}
                onclick={() => handleLectureCompletion()}
                text={!loading ? "Mark As Completed" : "Loading..."}
                customClasses="text-xl max-w-max px-4 mx-auto mb-4"
              />
            )}
            <IconBtn
              disabled={loading}
              onclick={() => {
                if (playerRef?.current) {
                  playerRef?.current?.seekTo(0)
                  setVideoEnded(false)
                  setPlaying(true)
                }
              }}
              text="Rewatch"
              customClasses="text-xl max-w-max px-4 mx-auto mb-4"
            />
            <div className="flex justify-center gap-4">
              {!isFirstVideo() && (
                <button
                  disabled={loading}
                  onClick={goToPrevVideo}
                  className="bg-richblack-700 text-white px-4 py-2 rounded hover:bg-richblack-600 transition-colors"
                >
                  Prev
                </button>
              )}
              {!isLastVideo() && (
                <button
                  disabled={loading}
                  onClick={goToNextVideo}
                  className="bg-richblack-700 text-white px-4 py-2 rounded hover:bg-richblack-600 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoDetails
// video
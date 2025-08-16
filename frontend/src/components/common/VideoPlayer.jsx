import React from 'react'
import { Player, BigPlayButton } from 'video-react'
import 'video-react/dist/video-react.css'

// Wrapper component to handle the video-react Player with React 19
const VideoPlayer = React.forwardRef((props, ref) => {
  return (
    <Player {...props} ref={ref}>
      <BigPlayButton position="center" />
    </Player>
  )
})

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer

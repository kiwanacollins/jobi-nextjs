'use client'
import React, { useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';


const YouTubeVideoPlayer = () => {
    const playerRef = useRef(null);

    const opts: YouTubeProps['opts'] = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

    const handleVideoEnd = ()  => {
        console.log('Video ended!');
        // Call your function here
        yourFunction();
      };
    
      // Your function to be triggered when the video ends
      const yourFunction = () => {
        // Perform any action you want here
      };
  return (
    <div>


<YouTube
      videoId="1VeP4h3NSbY" // Replace VIDEO_ID with your actual YouTube video ID
      onReady={event => event.target.playVideo()} // Ensure the video starts playing automatically
      onEnd={handleVideoEnd} // Trigger the function when the video ends
      ref={playerRef}
      opts={opts}
    />
    </div>
  )
}

export default YouTubeVideoPlayer
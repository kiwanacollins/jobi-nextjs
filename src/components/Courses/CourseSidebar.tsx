'use client';
import { updateCourseProgress } from '@/lib/actions/Course.action';
import { usePathname } from 'next/navigation';
import React, { useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface ICourseSidebarProps {
  videoId: string;
  userId: string;
  courseId: string;
  introVideo: string;
}

const CourseSidebar = ({
  videoId,
  userId,
  courseId,
  introVideo
}: ICourseSidebarProps) => {
  const pathname = usePathname();
  // const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  // const thumbnail = `https://img.youtube.com/vi/${videoId ?? '1VeP4h3NSbY'}/0.jpg`;

  const playerRef = useRef(null);

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  };

  const handleVideoClick = async (
    videoId: string,
    clerkId: string,
    course: string
  ) => {
    // setIsVideoOpen(true);

    if (!videoId) {
      return;
    }

    await updateCourseProgress({
      userId: clerkId,
      courseId: course,
      videoId: videoId,
      path: pathname
    });
  };

  return (
    <>
      {/* <h3 className="title">Intro</h3> */}

      <YouTube
        videoId={videoId || introVideo} // Replace VIDEO_ID with your actual YouTube video ID
        onReady={(event) => event.target.playVideo()} // Ensure the video starts playing automatically
        onEnd={() => handleVideoClick(videoId, userId, courseId)} // Trigger the function when the video ends
        ref={playerRef}
        opts={opts}
      />
    </>
  );
};

export default CourseSidebar;

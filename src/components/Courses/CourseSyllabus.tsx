'use client';
import { ICourse } from '@/database/Course.model';
import { IModule } from '@/database/Module.model';
import { UserProgressSchema } from '@/database/Progress.model';
import { IUser } from '@/database/user.model';
import { notifyError } from '@/utils/toast';
import { CheckCircleIcon, LockIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { Accordion } from 'react-bootstrap';

interface ICourseSyllabus {
  courseName: string;
  courseData: ICourse;
  user: IUser | null;
  userProgress: UserProgressSchema;
}

const CourseSyllabus = ({
  courseName,
  courseData,
  user,
  userProgress
}: ICourseSyllabus) => {
  const [openIndex, setOpenIndex] = useState(0);
  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const isUserEnrolled = courseData?.enrolledUsers?.includes(user?._id as any);

  return (
    <div className="mt-4">
      <Accordion activeKey={openIndex !== null ? openIndex.toString() : null}>
        {Array.isArray(courseData?.modules) &&
          courseData.modules.map((module: IModule, index: number) => (
            <Accordion.Item
              eventKey={index.toString()}
              key={index}
              className="border-1 shadow-sm mb-3"
            >
              <Accordion.Header onClick={() => toggleAccordion(index)}>
                <h5>{module.title}</h5>
              </Accordion.Header>
              <Accordion.Body>
                <div className="list-unstyled">
                  {module?.content?.map((video, videoIndex) => {
                    const isVideoWatched =
                      userProgress?.completedVideos?.includes(video.videoId);
                    return (
                      <div key={videoIndex}>
                        {!isUserEnrolled ? (
                          <button
                            onClick={() =>
                              notifyError(
                                'Please enroll to access course content'
                              )
                            }
                            className="d-flex align-items-center border-bottom pb-3 mb-2 cursor-pointer"
                          >
                            <LockIcon size={24} className="me-3 " />
                            <span>{video.title}</span>
                            {/* <span
                          className={`ms-auto text-muted ${isActive ? 'text-success' : ''}`}
                        >
                          {video.duration}
                        </span> */}
                          </button>
                        ) : (
                          <Link
                            href={{
                              pathname: `/courses/${courseName}`,
                              query: {
                                videoId: video?.videoId
                              }
                            }}
                            className="d-flex justify-content-between  align-items-center border-bottom pb-3 mb-2 cursor-pointer"
                          >
                            <div>
                              <VideoIcon size={24} className="me-3 " />
                              <span>{video.title}</span>
                            </div>
                            <div>
                              {isVideoWatched ? (
                                <CheckCircleIcon
                                  size={24}
                                  className="me-3 text-success"
                                />
                              ) : null}
                            </div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

export default CourseSyllabus;

'use client';

import { useState } from 'react';
import ModuleNameForm from './ModuleForm';
import { ICourse } from '@/database/Course.model';
import { IContent, IModule } from '@/database/Module.model';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { deleteModuleById } from '@/lib/actions/Course.action';
import { Accordion } from 'react-bootstrap';
import { VideoIcon } from 'lucide-react';
import ModalVideo from 'react-modal-video';

interface ICourseFormProps {
  type?: string;
  loggedInUserId?: string;
  courseId: string;
  courseData: ICourse;
}

const CourseContentForm = ({
  type,
  loggedInUserId,
  courseId,
  courseData
}: ICourseFormProps) => {
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string | undefined>('');

  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState(0);
  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleVideoClick = (videoId: string) => {
    setVideoId(videoId);
  };

  const handleDeleteModule = async (moduleId: string) => {
    // delete module
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteModuleById({
          moduleId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success'
          });
        }
        if (res?.error) {
          Swal.fire({ title: 'Error!', text: res.message, icon: 'error' });
        }
      }
    });
  };

  return (
    <>
      {/* Add module start */}
      <ModuleNameForm pathname={pathname} type={type} courseId={courseId} />
      {/* Add module end */}

      {Array.isArray(courseData?.modules) &&
        courseData?.modules?.map((module, moduleIndex) => {
          return (
            // Video accordion start
            <div key={module._id} className="bg-white card-box border-20 mt-40">
              <h5 className="dash-title-three">
                Module {moduleIndex + 1} - {module.title}
              </h5>
              <Accordion
                activeKey={openIndex !== null ? openIndex.toString() : null}
              >
                {/* Add Education Start */}
                <Accordion.Item
                  eventKey={moduleIndex.toString()}
                  className="border-1 shadow-sm mb-3"
                >
                  <Accordion.Header
                    onClick={() => toggleAccordion(moduleIndex)}
                  >
                    <h5>{module.title}</h5>
                  </Accordion.Header>
                  <Accordion.Body>
                    {module.content.length > 0 ? (
                      <div className="list-unstyled">
                        {module?.content?.map(
                          (video: IContent, videoIndex: number) => {
                            return (
                              <button
                                key={videoIndex}
                                className="d-flex w-100   align-items-center border-bottom pb-3 mb-2 cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleVideoClick(video.videoId ?? '');
                                  setIsVideoOpen(true);
                                }}
                              >
                                <VideoIcon size={24} className="me-3 " />
                                <span>{video.title}</span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <p>No content available</p>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Add Education End */}
              <div className="button-group d-inline-flex align-items-center mt-30">
                <Link
                  href={`/dashboard/admin-dashboard/courses/module/${module._id}`}
                  className="dash-btn-two tran3s me-3 px-4"
                >
                  Add Content
                </Link>
                <button
                  onClick={() => handleDeleteModule(module._id)}
                  className="dash-cancel-btn tran3s"
                >
                  Delete Module
                </button>
              </div>
            </div>
            // Add video end
          );
        })}
      {/* Video Accordion End */}
      <ModalVideo
        channel="youtube"
        isOpen={isVideoOpen}
        videoId={videoId as string}
        onClose={() => setIsVideoOpen(false)}
      />
    </>
  );
};
export default CourseContentForm;

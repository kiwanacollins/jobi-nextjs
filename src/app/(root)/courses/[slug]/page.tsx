import CourseSidebar from '@/components/Courses/CourseSidebar';
import CourseSyllabus from '@/components/Courses/CourseSyllabus';
import CourseBreadCrumb from '@/components/common/common-breadcrumb';
import {
  getSingleCourseById,
  getUserProgressStates
} from '@/lib/actions/Course.action';
import { getUserById } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';

const Page = async ({ searchParams, params }: SearchParamsProps) => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
  const { course } = await getSingleCourseById(params?.slug as string);
  const videoId = searchParams?.videoId;
  const result = await getUserProgressStates({
    userId: userId as string
  });
  // console.log('result', result);

  return (
    <>
      {/*breadcrumb start */}
      <CourseBreadCrumb title={course?.title} subtitle={course?.description} />
      {/*breadcrumb end */}
      <div className="container mx-auto  my-5">
        <div className="row">
          <div className="col-12 col-lg-6  candidates-profile-details">
            <CourseSidebar
              userId={mongoUser.clerkId}
              courseId={params?.slug as string}
              videoId={videoId as string}
              introVideo={course?.introVideo}
            />
          </div>
          <div className="col-12 col-lg-6 ">
            <div className="border shadow-sm p-2">
              <p className="text-success fw-bold ">Course Progess</p>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${result?.progress || 0}%` }}
                  aria-valuenow={result?.progress || 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {result?.progress || 0}%
                </div>
              </div>
            </div>
            <CourseSyllabus
              courseData={course}
              courseName={params?.slug as string}
              user={mongoUser}
              userProgress={result}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;

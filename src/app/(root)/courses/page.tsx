import CourseCard from '@/components/Courses/CourseCard';
import CourseBreadCrumb from '@/components/common/common-breadcrumb';
import { ICourse } from '@/database/Course.model';
import { getAllCourses } from '@/lib/actions/Course.action';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';

const Page = async () => {
  const { userId } = auth();
  const { courses } = await getAllCourses();
  const mongoUser = await getUserById({ userId });

  return (
    <>
      {/*breadcrumb start */}
      <CourseBreadCrumb
        title="Our Course"
        subtitle="View our course list and choose the best one for you"
      />
      {/*breadcrumb end */}

      {/* Courses Start */}
      <div className="container my-5 ">
        <div className="row">
          {courses?.map((course: ICourse) => (
            <CourseCard
              key={course._id}
              courseId={course._id as string}
              title={course.title}
              image={course.thumbnail.url}
              user={mongoUser}
              clerkId={userId}
            />
          ))}
        </div>
      </div>
      {/* Courses End */}
    </>
  );
};
export default Page;

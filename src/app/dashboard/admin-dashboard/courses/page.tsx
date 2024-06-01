import CourseCardAdmin from '@/components/Courses/CourseCardAdmin';
import { getAllCourses } from '@/lib/actions/Course.action';
import { getUserById } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
  const { courses } = await getAllCourses();
  return (
    <>
      <h2 className="main-title">All Courses</h2>
      <div>
        <Link
          href="/dashboard/admin-dashboard/courses/new"
          className="btn btn-success px-3 py-2"
        >
          Add Course
        </Link>
      </div>

      {/* Courses Start */}
      <div className="container my-5 ">
        <div className="row">
          {courses.map((course: any) => (
            <CourseCardAdmin
              key={course._id}
              id={course._id}
              title={course.title}
              image={course.thumbnail.url}
            />
          ))}
        </div>
      </div>
      {/* Courses End */}
    </>
  );
};
export default Page;

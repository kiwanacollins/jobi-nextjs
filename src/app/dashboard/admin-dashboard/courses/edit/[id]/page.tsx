import CourseForm from '@/components/Courses/CourseForm';
import { getSingleCourseById } from '@/lib/actions/Course.action';
import { getUserById } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';

const Page = async ({ params }: SearchParamsProps) => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
  const { course } = await getSingleCourseById(params?.id as string);
  return (
    <>
      <h2 className="main-title">Update Course</h2>
      {/* Add Course Form Start */}
      <CourseForm
        courseData={course}
        loggedInUserId={mongoUser._id as string}
        type="edit"
      />
      {/* Add Course Form End */}
    </>
  );
};
export default Page;

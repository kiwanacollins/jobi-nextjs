import CourseContentForm from '@/components/Courses/CourseContentForm';
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
      <h2 className="main-title">Add Modules</h2>
      {/* Add Course Form Start */}
      <CourseContentForm
        courseId={params?.id as string}
        courseData={course}
        loggedInUserId={mongoUser._id as string}
        type="add"
      />
      {/* Add Course Form End */}
    </>
  );
};
export default Page;

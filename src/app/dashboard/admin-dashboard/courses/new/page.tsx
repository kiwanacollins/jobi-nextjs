import CourseForm from '@/components/Courses/CourseForm';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';

const Page = async () => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
  return (
    <>
      <h2 className="main-title">Add New Course</h2>
      {/* Add Course Form Start */}
      <CourseForm loggedInUserId={mongoUser._id as string} type="add" />
      {/* Add Course Form End */}
    </>
  );
};
export default Page;

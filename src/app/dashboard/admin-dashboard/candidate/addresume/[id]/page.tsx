import DashboardResume from '@/components/dashboard/candidate/dashboard-resume';
import { getResumeById } from '@/lib/actions/candidate.action';
import { getUserById, getUserByMongoId } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface ParamsProps {
  params: {
    id: string;
  };
}

const AddResumePage = async ({ params }: ParamsProps) => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
  const mongoUser = await getUserByMongoId({ id: params.id });
  let currentResume = null;
  if (mongoUser?.resumeId) {
    currentResume = await getResumeById(mongoUser?.resumeId);
  }

  return (
    <>
      {/* Resume area start */}
      <DashboardResume resume={currentResume} mongoUser={mongoUser} />
      {/* Resume area end */}
    </>
  );
};
export default AddResumePage;

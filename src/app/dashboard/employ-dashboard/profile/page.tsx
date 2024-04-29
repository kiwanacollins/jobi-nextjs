import EmployerProfileFormArea from '@/components/dashboard/employ/EmployerProfileFormArea';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const EmployDashboardProfilePage = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const mongoUser = await getUserById({ userId });
  if (mongoUser?.role !== 'employee') {
    redirect('/');
  }
  return (
    <>
      {/* profile area start */}
      <EmployerProfileFormArea mongoUser={mongoUser} />
      {/* profile area end */}
    </>
  );
};

export default EmployDashboardProfilePage;

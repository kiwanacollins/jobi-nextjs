import EmployProfileArea from '@/app/components/dashboard/employ/profile-area';
import { IUser } from '@/database/user.model';
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
      <EmployProfileArea mongoUser={mongoUser as IUser} />
      {/* profile area end */}
    </>
  );
};

export default EmployDashboardProfilePage;

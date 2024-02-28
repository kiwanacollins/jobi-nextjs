import EmployProfileArea from '@/app/components/dashboard/employ/profile-area';
import { IUser } from '@/database/user.model';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';

const EmployDashboardProfilePage = async () => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
  return (
    <>
      {/* profile area start */}
      <EmployProfileArea mongoUser={mongoUser as IUser} />
      {/* profile area end */}
    </>
  );
};

export default EmployDashboardProfilePage;

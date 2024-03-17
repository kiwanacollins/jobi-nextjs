import { auth } from '@clerk/nextjs';
import EmployerProfileFormArea from '../components/dashboard/employ/EmployerProfileFormArea';
import { getUserById } from '@/lib/actions/user.action';

const Page = async () => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
  return (
    <>
      <div className="d-flex container align-items-center justify-content-center ">
        <div className="dashboard-body">
          <EmployerProfileFormArea mongoUser={mongoUser} />
        </div>
      </div>
    </>
  );
};
export default Page;

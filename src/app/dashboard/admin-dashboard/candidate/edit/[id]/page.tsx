import UpdateUserArea from '@/app/components/dashboard/admin/candidates/UpdateUserArea';
import { getUserByMongoId } from '@/lib/actions/user.action';

interface ParamsProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: ParamsProps) => {
  const mongoUser = await getUserByMongoId({ id: params.id });

  return (
    <>
      <UpdateUserArea mongoUser={mongoUser} />
    </>
  );
};
export default Page;

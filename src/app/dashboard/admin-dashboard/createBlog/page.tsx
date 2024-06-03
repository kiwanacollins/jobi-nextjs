import Blog from '@/components/dashboard/admin/blog/Blog';
import { getUserById } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
  return (
    <div>
      <h2 className="main-title">Post Blog</h2>
      <Blog type="add" />
    </div>
  );
};
export default Page;

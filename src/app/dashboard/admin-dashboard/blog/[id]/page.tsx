import Blog from '@/components/dashboard/admin/blog/Blog';
import { getBlogBySlugOrId } from '@/lib/actions/blog.action';
import { getUserById } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}
const Page = async ({ params }: URLProps) => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
  const blog = await getBlogBySlugOrId(params.id);
  return (
    <div>
      <h2 className="main-title">Update Blog</h2>
      <Blog type="edit" blog={blog} />
    </div>
  );
};
export default Page;

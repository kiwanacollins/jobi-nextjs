import BlogsTable from '@/components/dashboard/admin/blog/BlogsTable';
import { fetchAllBlogs } from '@/lib/actions/blog.action';
import { getUserById } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AllBlogsPage = async () => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
  const blogs = await fetchAllBlogs();
  return (
    <div>
      <h2 className="main-title">All Blogs</h2>
      <div className="container-flued ">
        <BlogsTable blogs={blogs} />
      </div>
    </div>
  );
};
export default AllBlogsPage;

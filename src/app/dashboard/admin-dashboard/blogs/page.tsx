import BlogsTable from '@/components/dashboard/admin/blog/BlogsTable';
import { fetchAllBlogs } from '@/lib/actions/blog.action';

const AllBlogsPage = async () => {
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

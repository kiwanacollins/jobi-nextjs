import BlogCard from '@/components/dashboard/admin/blog/BlogCard';
import { IBlog } from '@/database/Blog.model';
import { fetchAllBlogs } from '@/lib/actions/blog.action';

const AllBlogsPage = async () => {
  const blogs = await fetchAllBlogs();
  return (
    <div>
      <h2 className="main-title">All Blogs</h2>
      <div className="container mx-auto ">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gap-4">
          {blogs?.map((blog: IBlog, index: any) => {
            return <BlogCard key={index} blog={blog} />;
          })}
        </div>
      </div>
    </div>
  );
};
export default AllBlogsPage;

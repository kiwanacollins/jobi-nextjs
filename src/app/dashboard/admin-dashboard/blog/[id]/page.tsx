import Blog from '@/components/dashboard/admin/blog/Blog';
import { getBlogById } from '@/lib/actions/blog.action';
interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}
const Page = async ({ params }: URLProps) => {
  const blog = await getBlogById(params.id);
  return (
    <div>
      <h2 className="main-title">Update Blog</h2>
      <Blog type="edit" blog={blog} />
    </div>
  );
};
export default Page;

import Blog from '@/components/dashboard/admin/blog/Blog';

const Page = () => {
  return (
    <div>
      <h2 className="main-title">Post Blog</h2>
      <Blog type="add" />
    </div>
  );
};
export default Page;

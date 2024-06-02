import ReviewForm from '@/components/dashboard/admin/Reviews/ReviewForm';

const Page = () => {
  return (
    <>
      <h2 className="main-title">Add New Review</h2>
      {/* Add Review Form Start */}
      <ReviewForm type="add" />
      {/* Add Review Form End */}
    </>
  );
};
export default Page;

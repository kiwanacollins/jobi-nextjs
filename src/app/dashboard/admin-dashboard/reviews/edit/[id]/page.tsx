import ReviewForm from '@/components/dashboard/admin/Reviews/ReviewForm';
import { getSingleTestimonial } from '@/lib/actions/Testimonial.action';
import { SearchParamsProps } from '@/types';

const Page = async ({ params }: SearchParamsProps) => {
  const reviewData = await getSingleTestimonial({ id: params?.id as string });
  return (
    <>
      <h2 className="main-title">Update Review</h2>
      {/* Add Review Form Start */}
      <ReviewForm
        reviewId={reviewData._id}
        reviewData={reviewData}
        type="edit"
      />
      {/* Add Review Form End */}
    </>
  );
};
export default Page;

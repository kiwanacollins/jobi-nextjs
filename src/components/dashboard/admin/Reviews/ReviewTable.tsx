import { ITestimonial } from '@/database/Testimonial';
import ReviewItem from './ReviewItem';

interface IReviewProps {
  reviews: ITestimonial[];
}

const ReviewTable = ({ reviews }: IReviewProps) => {
  return (
    <div className="table-responsive">
      <table className="table job-alert-table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Review Text</th>
            <th scope="col">Desciption</th>
            <th scope="col">Ratting</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="border-0">
          {reviews?.map((review, index) => (
            <ReviewItem
              reviewId={review._id}
              serial={index + 1}
              key={review._id}
              name={review.name}
              reviewText={review.review_text}
              desc={review.desc}
              image={review.image.url}
              reviewStar={review.review_star}
            />
          ))}

          {reviews.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ReviewTable;

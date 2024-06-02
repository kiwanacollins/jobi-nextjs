import Image from 'next/image';
import ReviewActionDropDown from './ReviewActionDropDown';

interface ReviewItemProps {
  reviewId: string;
  serial: number;
  name: string;
  reviewText: string;
  desc: string;
  image: string;
  reviewStar: number;
}

const ReviewItem = ({
  reviewId,
  serial,
  desc,
  name,
  image,
  reviewStar,
  reviewText
}: ReviewItemProps) => {
  return (
    <tr>
      <td>
        <div className="job-name fw-500">{serial}</div>
      </td>
      <td>
        <div className="job-name fw-500">
          <Image src={image} alt={name} width={50} height={50} />
        </div>
      </td>
      <td>
        <div className="job-name fw-500">{name}</div>
      </td>
      <td>
        <div className="job-name fw-500">{reviewText}</div>
      </td>
      <td>
        <div className="job-status text-capitalize">{desc}</div>
      </td>
      <td>
        <div className=" p-2 badge bg-success text-white ">{reviewStar}</div>
      </td>
      <td>
        <div className="action-dots float-end">
          <button
            className="action-btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span></span>
          </button>
          <ReviewActionDropDown reviewId={reviewId} />
        </div>
      </td>
    </tr>
  );
};
export default ReviewItem;

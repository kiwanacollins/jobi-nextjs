'use client';
import edit from '@/assets/dashboard/images/icon/icon_20.svg';
import delete_icon from '@/assets/dashboard/images/icon/icon_21.svg';
import { deleteTestimonial } from '@/lib/actions/Testimonial.action';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Swal from 'sweetalert2';

interface IReviewActionDropDown {
  reviewId: string;
}
const ReviewActionDropDown = ({ reviewId }: IReviewActionDropDown) => {
  const pathname = usePathname();
  const handleDeleteReview = async (reviewId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteTestimonial({
          id: reviewId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success'
          });
        }
        if (res?.error) {
          Swal.fire({ title: 'Error!', text: res.message, icon: 'error' });
        }
      }
    });
  };
  return (
    <ul className="dropdown-menu dropdown-menu-end">
      <li className="dropdown-item">
        <Link
          className="dropdown-item"
          href={`/dashboard/admin-dashboard/reviews/edit/${reviewId}`}
        >
          <Image src={edit} alt="icon" className="lazy-img" /> Edit
        </Link>
      </li>
      <li className="dropdown-item">
        <button
          onClick={() => handleDeleteReview(reviewId)}
          className="dropdown-item"
        >
          <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
        </button>
      </li>
    </ul>
  );
};
export default ReviewActionDropDown;

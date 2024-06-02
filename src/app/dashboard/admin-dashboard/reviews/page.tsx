import ReviewTable from '@/components/dashboard/admin/Reviews/ReviewTable';
import { getTestimonials } from '@/lib/actions/Testimonial.action';
import { getUserById } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
  const reviews = await getTestimonials();
  return (
    <>
      <h2 className="main-title">Reviews</h2>
      <Link
        href="/dashboard/admin-dashboard/reviews/new"
        className="btn btn-success px-3 py-2"
      >
        Add Testimonial
      </Link>

      {/* Reviews Table Start */}
      <ReviewTable reviews={reviews} />
      {/* Reviews Table End */}
    </>
  );
};
export default Page;

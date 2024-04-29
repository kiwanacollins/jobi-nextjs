import CommonBreadcrumb from '@/components/common/common-breadcrumb';
import WishlistArea from '@/components/wishlist/wishlist-area';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (!currentUser || currentUser.role === 'employee') {
    return redirect('/');
  }
  return (
    <>
      {/* search breadcrumb start */}
      <CommonBreadcrumb
        title="Wishlist"
        subtitle="Find your desire company and get your dream job"
      />
      {/* search breadcrumb end */}

      {/* wishlist area start */}
      <WishlistArea />
      {/* wishlist area end */}
    </>
  );
};
export default Page;

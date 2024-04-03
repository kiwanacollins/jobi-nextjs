import CommonBreadcrumb from '@/app/components/common/common-breadcrumb';
import WishlistArea from '@/app/components/wishlist/wishlist-area';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role === 'employee') {
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

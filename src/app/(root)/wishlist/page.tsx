import CommonBreadcrumb from '@/app/components/common/common-breadcrumb';
import WishlistArea from '@/app/components/wishlist/wishlist-area';

const Page = () => {
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

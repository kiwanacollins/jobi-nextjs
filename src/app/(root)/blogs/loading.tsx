import CommonBreadcrumb from '@/components/common/common-breadcrumb';
import BlogCardSkeleton from '@/components/skaletons/BlogCardSkeleton';

const BlogsLoadingPage = () => {
  return (
    <>
      {/*breadcrumb start */}
      <CommonBreadcrumb
        title="Blog"
        subtitle="Read our blog from top talents"
      />
      {/*breadcrumb end */}
      {/* blog v3 start */}
      <section className="blog-section bg-color pt-100 lg-pt-80 pb-120 lg-pb-80">
        <div className="container">
          <div className="row gx-xl-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="col-md-6">
                <BlogCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* blog v3 end */}
    </>
  );
};
export default BlogsLoadingPage;

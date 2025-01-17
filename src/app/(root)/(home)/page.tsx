import BlogFour from '@/components/blogs/blog-four';
import { TrendingJobs } from '@/components/category/category-section-3';
import CategorySectionSix from '@/components/category/category-section-6';
import FancyBannerThree from '@/components/fancy-banner/fancy-banner-3';
import FancyBannerSix from '@/components/fancy-banner/fancy-banner-6';
import FeatureNine from '@/components/features/feature-nine';
import FeatureTwo from '@/components/features/feature-two';
import FeedbackFive from '@/components/feedBacks/feedback-five';
import HeroBannerSix from '@/components/hero-banners/hero-banner-six';
import { JobListItems } from '@/components/jobs/list/job-list-one';
import { getTestimonials } from '@/lib/actions/Testimonial.action';
import Link from 'next/link';

export default async function HomePage() {
  const reviews = await getTestimonials();
  return (
    <>
      {/* hero banner start */}
      <HeroBannerSix />
      {/* hero banner end */}

      {/* partners logo end*/}

      {/* category section start */}
      <CategorySectionSix style_2={true} />
      {/* category section end */}

      {/* trending jobs start */}

      <section className="category-section-three pt-140 lg-pt-100">
        <div className="container">
          <div className="position-relative">
            <div className="title-one mb-60 lg-mb-40">
              <h2
                className="main-font color-blue wow fadeInUp"
                data-wow-delay="0.3s"
              >
                Trending Job
              </h2>
            </div>
            <TrendingJobs />
          </div>
        </div>
      </section>
      {/* trending jobs end */}

      {/* job list items start */}
      <section className="job-listing-one mt-160 lg-mt-100 sm-mt-80">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6">
              <div className="title-one">
                <h2
                  className="main-font color-blue wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  New job listing
                </h2>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="d-flex justify-content-lg-end">
                <Link
                  href="/jobs"
                  className="btn-six text-decoration-none d-none d-lg-inline-block"
                >
                  Explore all jobs
                </Link>
              </div>
            </div>
          </div>
          <div className="job-listing-wrapper mt-60 md-mt-40 wow fadeInUp">
            <JobListItems style_2={true} />
          </div>
          <div className="text-center mt-40 d-lg-none">
            <Link href="/jobs" className="btn-six">
              Explore all jobs
            </Link>
          </div>
        </div>
      </section>
      {/* job list items end */}

      {/* fancy banner start */}
      <FancyBannerThree style_2={true} />
      {/* fancy banner end */}

      {/* text feature start */}
      <FeatureNine />
      {/* text feature end */}

      {/* feedback start */}
      <FeedbackFive reviews={reviews} />
      {/* feedback end */}

      {/* blog start */}
      <BlogFour />
      {/* blog end */}

      {/* text feature two start */}
      <FeatureTwo />
      {/* text feature two end */}

      {/* fancy banner start */}
      <FancyBannerSix />
      {/* fancy banner end */}
    </>
  );
}

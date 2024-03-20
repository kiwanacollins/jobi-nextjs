import BlogFour from '@/app/components/blogs/blog-four';
import { TrendingJobs } from '@/app/components/category/category-section-3';
import CategorySectionSix from '@/app/components/category/category-section-6';
import FancyBannerThree from '@/app/components/fancy-banner/fancy-banner-3';
import FancyBannerSix from '@/app/components/fancy-banner/fancy-banner-6';
import FeatureNine from '@/app/components/features/feature-nine';
import FeatureTwo from '@/app/components/features/feature-two';
import FeedbackFive from '@/app/components/feedBacks/feedback-five';
import HeroBannerSix from '@/app/components/hero-banners/hero-banner-six';
import { JobListItems } from '@/app/components/jobs/list/job-list-one';
import PartnersSlider from '@/app/components/partners/partners-slider';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* hero banner start */}
      <HeroBannerSix />
      {/* hero banner end */}

      {/* partners logo start*/}
      <div className="partner-logos bg-color border-0 pt-45 pb-45 ps-3 pe-3">
        <PartnersSlider />
      </div>
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
          <div className="text-center mt-50 wow fadeInUp">
            <div className="btn-eight fw-500">
              Do you want to post a job for your company?{' '}
              <span>We can help.</span> <Link href="/sign-in">Click here</Link>
            </div>
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
      <FeedbackFive />
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

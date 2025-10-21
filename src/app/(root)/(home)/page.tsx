import { Metadata } from 'next';
import BlogFour from '@/components/blogs/blog-four';
import FeatureNine from '@/components/features/feature-nine';
import FeatureTwo from '@/components/features/feature-two';
import FeedbackFive from '@/components/feedBacks/feedback-five';
import HeroBannerSix from '@/components/hero-banners/hero-banner-six';
import { JobListItems } from '@/components/jobs/list/job-list-one';
import { getTestimonials } from '@/lib/actions/Testimonial.action';
import Link from 'next/link';
import { siteMetadata, buildUrl } from '@/lib/seo';

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Jobs in Uganda & Remote Roles for Ugandan Professionals',
  description:
    'Browse the latest verified vacancies in Kampala, Entebbe, Gulu, and remote employers hiring Ugandan talent. Search by skill, industry, or location and apply in minutes.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Ugandan Jobs | Fresh Vacancies for Ugandan Job Seekers',
    description:
      'Discover curated job listings across Uganda and international companies recruiting Ugandan professionals.',
    url: buildUrl('/'),
    images: [
      {
        url: buildUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: `${siteMetadata.siteName} hero`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Next Job in Uganda',
    description:
      'Daily updated vacancies for Ugandan professionals including remote and overseas opportunities.'
  }
};

export default async function HomePage() {
  const reviews = await getTestimonials();
  return (
    <>
      {/* hero banner start */}
      <HeroBannerSix />
      {/* hero banner end */}

      {/* partners logo end*/}

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
    </>
  );
}

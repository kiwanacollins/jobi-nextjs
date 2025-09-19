import React from 'react';
import { Metadata } from 'next';
import JobBreadcrumb from '@/components/jobs/breadcrumb/job-breadcrumb';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import CandidateSkeletonLoading from '@/components/skaletons/CandidateSkeletonLoading';
import FilterSkeleton from '@/components/skaletons/FilterSkeleton';

export const metadata: Metadata = {
  title: 'Jobs - Ugandan Jobs',
  description:
    'Explore a wide range of job opportunities on Ugandan Jobs. From tech to marketing, find your dream job and take the next step in your career. Your future starts here.'
};

const JobLoadingPage = () => {
  return (
    <>
      {/* search breadcrumb start */}
      <JobBreadcrumb />
      {/* search breadcrumb end */}

      {/* job list three start */}
      <section className="candidates-profile pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4">
              {/* filter area start */}
              <FilterSkeleton />
              {/* filter area end */}
            </div>

            <div className="col-xl-9 col-lg-8">
              <div className="ms-xxl-5 ms-xl-3">
                <div className="upper-filter d-flex justify-content-between align-items-center mb-20">
                  <div className="total-job-found placeholder col-6 bg-success ">
                    <span className="text-dark   fw-500"></span>{' '}
                  </div>
                </div>

                {[1, 2, 3, 4, 5, 6]?.map((item) => (
                  <CandidateSkeletonLoading key={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* job list three end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default JobLoadingPage;

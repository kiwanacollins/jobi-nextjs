import JobBreadcrumb from '../../components/jobs/breadcrumb/job-breadcrumb';
import JobPortalIntro from '../../components/job-portal-intro/job-portal-intro';
import CandidateV1FilterArea from '@/app/components/candidate/filter/candidate-v1-filter-area';

import CandidateSkeletonLoading from '@/app/components/skaletons/CandidateSkeletonLoading';

const Loading = () => {
  return (
    <div>
      {/* search breadcrumb start */}
      <JobBreadcrumb
        title="Candidates"
        subtitle="Find you desire talents & make your work done"
      />
      {/* search breadcrumb end */}

      {/* candidate area start */}
      <section className="candidates-profile pt-110 lg-pt-80 pb-160 xl-pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-4">
              <button
                type="button"
                className="filter-btn w-100 pt-2 pb-2 h-auto fw-500 tran3s d-lg-none mb-40"
                data-bs-toggle="offcanvas"
                data-bs-target="#filteroffcanvas"
              >
                <i className="bi bi-funnel"></i>
                Filter
              </button>
              {/* filter area start */}
              <CandidateV1FilterArea />
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

      {/* candidate area end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </div>
  );
};
export default Loading;

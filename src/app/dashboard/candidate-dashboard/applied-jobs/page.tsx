import ListItemTwo from '@/components/jobs/list/list-item-2';
import { getAppliedJobs } from '@/lib/actions/candidate.action';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AppliedJobsPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'candidate') {
    redirect('/');
  }
  const { appliedJobs: jobs } = await getAppliedJobs({ clerkId: userId });
  return (
    <section className="job-listing-three  pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="filter-area-tab">
              <div className="light-bg border-20 pe-4">
                <a className="filter-header border-20 d-block search">
                  <span className="main-title fw-500 text-dark">
                    {jobs.length === 0
                      ? 'No Applied Jobs Found'
                      : 'Applied Jobs'}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {jobs.length > 0 && (
            <div className="col-12">
              <div className="job-post-item-wrapper">
                <div className="upper-filter d-flex justify-content-between align-items-center mb-25 mt-40 lg-mt-40">
                  <div className="total-job-found">
                    All <span className="text-dark">{jobs?.length}</span> jobs
                    found
                  </div>
                </div>
                <div className={`accordion-box list-style show`}>
                  {jobs?.map((job: any) => (
                    <ListItemTwo key={job._id} item={job} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default AppliedJobsPage;

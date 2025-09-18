import CandidateListItem from '@/components/candidate/candidate-list-item';
import { IUser } from '@/database/user.model';
import { getJobApplicantsBySlugOrId } from '@/lib/actions/employee.action';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface ParamsProps {
  params: { id: string };
}

const JobApplicantsPage = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }
  const { applicants, jobTitle } = await getJobApplicantsBySlugOrId(
    params.id as string
  );
  return (
    <div className="candidates-profile position-relative">
      <div className="d-flex flex-column gap-3  flex-md-row  align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 className="main-title m0">Job Applicants: {jobTitle}</h2>
      </div>

      <div className="accordion-box list-style show">
        {applicants.map((item: IUser) => (
          <CandidateListItem
            loggedInUser={currentUser}
            key={item._id}
            item={item}
          />
        ))}
      </div>
      {applicants.length === 0 && (
        <div className="text-center">
          <h3>No applicants Yet</h3>
        </div>
      )}
      {/* Pagination start */}
      {/* <div className="dash-pagination d-flex justify-content-end mt-30">
          <ul className="style-none d-flex align-items-center">
            <li>
              <a href="#" className="active">
                1
              </a>
            </li>
            <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#">3</a>
            </li>
            <li>..</li>
            <li>
              <a href="#">7</a>
            </li>
            <li>
              <a href="#">
                <i className="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </div> */}
      {/* Pagination end */}
    </div>
  );
};
export default JobApplicantsPage;

import React from 'react';
import { IUser } from '@/database/user.model';
import CandidateListItem from '@/app/components/candidate/candidate-list-item';

interface IProps {
  candidates: IUser[];
}

const SavedCandidateListArea = ({ candidates }: IProps) => {
  return (
    <section className="  pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          {candidates.length > 0 && (
            <div className="col-12">
              <div className="job-post-item-wrapper">
                <div className="upper-filter d-flex justify-content-between align-items-center mb-25 lg-mt-40">
                  <div className="total-job-found">
                    All <span className="text-dark">{candidates?.length}</span>{' '}
                    Candidate found
                  </div>
                </div>
                <div className={`accordion-box list-style list show`}>
                  {candidates?.map((item) => (
                    <CandidateListItem
                      // loggedInUser={loggedInUser}
                      key={item._id}
                      item={item}
                    />
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

export default SavedCandidateListArea;

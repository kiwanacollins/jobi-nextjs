'use client';
import React, { useState } from 'react';
// import candidate_data from '@/data/candidate-data';
import CandidateGridItem from './candidate-grid-item';
import CandidateListItem from './candidate-list-item';
import CandidateV1FilterArea from './filter/candidate-v1-filter-area';
import ShortSelect from '../common/short-select';
import { IUser } from '@/database/user.model';
import CommonPagination from '../common/CommonPagination';

// import { IResumeType } from '@/database/resume.model';

interface IProps {
  style_2?: boolean;
  candidates?: any[] | undefined;
  loggedInUser?: IUser;
  pageNumber: number;
  isNext: boolean;
}

const CandidateV1Area = ({
  style_2 = false,
  candidates,
  loggedInUser,
  pageNumber,
  isNext
}: IProps) => {
  const [jobType, setJobType] = useState<string>(style_2 ? 'list' : 'grid');

  return (
    <>
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
                  <div className="total-job-found">
                    All{' '}
                    <span className="text-dark fw-500">
                      {candidates?.length}
                    </span>{' '}
                    candidates found
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="short-filter d-flex align-items-center">
                      <div className="text-dark fw-500 me-2">Short:</div>
                      <ShortSelect />
                    </div>
                    <button
                      onClick={() => setJobType('list')}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 list-btn ${jobType === 'grid' ? 'active' : ''}`}
                      title="Active List"
                    >
                      <i className="bi bi-list"></i>
                    </button>
                    <button
                      onClick={() => setJobType('grid')}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn ${jobType === 'list' ? 'active' : ''}`}
                      title="Active Grid"
                    >
                      <i className="bi bi-grid"></i>
                    </button>
                  </div>
                </div>

                <div
                  className={`accordion-box grid-style ${jobType === 'grid' ? 'show' : ''}`}
                >
                  <div className="row">
                    {candidates?.map((item) => (
                      <div key={item._id} className="col-xxl-4 col-sm-6 d-flex">
                        <CandidateGridItem item={item} />
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`accordion-box list-style ${jobType === 'list' ? 'show' : ''}`}
                >
                  {candidates?.map((item) => (
                    <CandidateListItem
                      loggedInUser={loggedInUser}
                      key={item._id}
                      item={item}
                    />
                  ))}
                </div>

                <div className="pt-20 d-sm-flex align-items-center justify-content-center">
                  <div className="d-flex justify-content-center">
                    <CommonPagination isNext={isNext} pageNumber={pageNumber} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CandidateV1Area;

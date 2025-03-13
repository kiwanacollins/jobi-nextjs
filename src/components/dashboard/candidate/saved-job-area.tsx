/* eslint-disable camelcase */
'use client';
import React, { useState } from 'react';

import { useAppSelector } from '@/redux/hook';
import ListItemTwo from '@/components/jobs/list/list-item-2';
import JobGridItem from '@/components/jobs/grid/job-grid-item';

const SavedJobArea = () => {
  const [jobType, setJobType] = useState<string>('list');
  const { wishlist } = useAppSelector((state) => state.wishlist);

  return (
    <section className="job-listing-three  pb-160 xl-pb-150 lg-pb-80">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="filter-area-tab">
              <div className="light-bg border-20 pe-4">
                <a className="filter-header border-20 d-block search">
                  <span className="main-title fw-500 text-dark">
                    {wishlist.length === 0
                      ? 'No saved Job Found in Your Wishlist.'
                      : 'Saved Jobs'}
                  </span>
                </a>
              </div>
            </div>
          </div>

          {wishlist.length > 0 && (
            <div className="col-12">
              <div className="job-post-item-wrapper">
                <div className="upper-filter d-flex justify-content-between align-items-center mb-25 mt-40 lg-mt-40">
                  <div className="total-job-found">
                    All <span className="text-dark">{wishlist?.length}</span>{' '}
                    jobs found
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      onClick={() => setJobType('list')}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 list-btn 
                     ${jobType === 'grid' ? 'active' : ''}`}
                      title="Active List"
                    >
                      <i className="bi bi-list"></i>
                    </button>
                    <button
                      onClick={() => setJobType('grid')}
                      className={`style-changer-btn text-center rounded-circle tran3s ms-2 grid-btn 
                    ${jobType === 'list' ? 'active' : ''}`}
                      title="Active Grid"
                    >
                      <i className="bi bi-grid"></i>
                    </button>
                  </div>
                </div>
                <div
                  className={`accordion-box list-style ${jobType === 'list' ? 'show' : ''}`}
                >
                  {wishlist?.map((job) => (
                    <ListItemTwo key={job._id} item={job} />
                  ))}
                </div>

                <div
                  className={`accordion-box grid-style ${jobType === 'grid' ? 'show' : ''}`}
                >
                  <div className="row">
                    {wishlist?.map((job) => (
                      <div key={job._id} className="col-sm-6 mb-30">
                        <JobGridItem item={job} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SavedJobArea;

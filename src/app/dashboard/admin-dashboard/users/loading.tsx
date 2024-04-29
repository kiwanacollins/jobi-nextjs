import React from 'react';
// import candidate_data from '@/data/candidate-data';

import CandidateSkeletonLoading from '@/components/skaletons/CandidateSkeletonLoading';

const Loading = () => {
  return (
    <div className="position-relative">
      <div className="d-flex align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 className="main-title placeholder placeholder-wave col-2  bg-success m0"></h2>
        <div className="short-filter d-flex gap-3  placeholder placeholder-wave col-2  bg-success align-items-center">
          <div className="text-dark fw-500 placeholder placeholder-wave col-2  bg-success  me-2"></div>
          <div className="text-dark placeholder placeholder-wave col-2  bg-success fw-500 me-2"></div>
        </div>
      </div>

      {[1, 2, 3, 4, 5, 6].map((item) => (
        <CandidateSkeletonLoading key={item} />
      ))}

      <div className="dash-pagination d-flex justify-content-end mt-30">
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
      </div>
    </div>
  );
};

export default Loading;

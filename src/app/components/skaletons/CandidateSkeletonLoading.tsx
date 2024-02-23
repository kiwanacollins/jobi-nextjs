import React from 'react';

const CandidateSkeletonLoading = () => {
  return (
    <div
      className={`candidate-profile-card  border-0 list-layout h-75   col-12  mb-25`}
    >
      <div className="d-flex">
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
          <div className="rounded-circle placeholder-wave col-12 bg-success">
            <div
              style={{ width: '80px', height: '80px' }}
              className="lazy-img rounded-circle placeholder col-12 bg-success"
            ></div>
          </div>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className="col-xl-3">
              <div className="position-relative">
                <h4 className="candidate-name mb-0 placeholder-lg placeholder col-8 bg-success">
                  <span className="tran3s placeholder-wave ">
                    <span className="placeholder-lg col-8 bg-success"></span>
                  </span>
                </h4>
                <div className="candidate-post">
                  <span className="placeholder col-6 bg-success"></span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>
                  <span className="placeholder col-4 bg-success"></span>
                </span>
                <div>
                  <span className="placeholder col-8 bg-success"></span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>
                  <span className="placeholder col-4 bg-success"></span>
                </span>
                <div>
                  <span className="placeholder col-8 bg-success"></span>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="d-flex justify-content-lg-end ">
                <span className="save-btn text-center placeholder-wave col-8 bg-success rounded-circle tran3s mt-10">
                  <i className="bi bi-heart"></i>
                </span>
                <span className="profile-btn tran3s placeholder-wave col-8 bg-success  ms-md-2 mt-10 sm-mt-20">
                  <span className="placeholder col-12 bg-success"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSkeletonLoading;

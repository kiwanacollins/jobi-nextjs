'use client';
import React from 'react';
import Link from 'next/link';
import { IJobData } from '@/database/job.model';

interface RelatedJobsProps {
  jobs: IJobData[];
}

const RelatedJobs: React.FC<RelatedJobsProps> = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <div className="related-jobs-section mt-60 lg-mt-50">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3 className="fw-600 mb-40 lg-mb-30">Related Jobs</h3>
          </div>
        </div>
        
        <div className="row gx-xxl-5 gy-3">
          {jobs.map((job, index) => (
            <div key={job._id} className="col-12 col-md-6 col-xl-4 mb-3">
              <div className="job-list-one style-two position-relative border-style h-100">
                <div className="job-title d-flex align-items-center flex-wrap gap-3">
                  <div className="logo order-md-1 flex-shrink-0">
                    {job.companyImage ? (
                      <img
                        src={job.companyImage}
                        alt={`${job.company} logo`}
                        className="lazy-img m-auto"
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '50%'
                        }}
                      />
                    ) : (
                      <div 
                        className="d-flex align-items-center justify-content-center text-white fw-600"
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor: '#00BF63',
                          fontSize: '18px'
                        }}
                      >
                        {job.company ? job.company.charAt(0).toUpperCase() : 'J'}
                      </div>
                    )}
                  </div>
                  <div className="split-box1 order-md-0" style={{minWidth:'0'}}>
                    <h4 className="job-duration fw-500 mb-1">{job.duration || 'Full-time'}</h4>
                    <h4 className="tran3s fw-500 fs-18 mb-0 text-truncate">
                      <Link 
                        href={`/jobs/${job.slug}`}
                        className="title tran3s"
                      >
                        {job.title}
                      </Link>
                    </h4>
                  </div>
                </div>
                
                <div className="job-salary d-none d-md-block">
                  <span className="fw-500 text-dark">
                    {job.minSalary && job.maxSalary 
                      ? `$${job.minSalary} - $${job.maxSalary}` 
                      : job.minSalary 
                        ? `$${job.minSalary}+`
                        : 'Salary negotiable'
                    }
                    {job.salary_duration && (
                      <span className="text-muted">/{job.salary_duration}</span>
                    )}
                  </span>
                </div>
                
                <div className="job-tag-2 d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="job-location d-flex align-items-center">
                    <i className="bi bi-geo-alt"></i>
                    <span>{job.location || 'Remote'}</span>
                  </div>
                  
                  <div className="job-category">
                    <span className="badge bg-light text-dark px-3 py-2">
                      {job.category}
                    </span>
                  </div>
                </div>
                
                <div className="btn-wrapper d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div className="job-posted text-muted small">
                    {job.company}
                  </div>
                  
                  <Link 
                    href={`/jobs/${job.slug}`}
                    className="apply-btn text-center tran3s"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Show More Jobs Button */}
        <div className="row">
          <div className="col-12 text-center mt-40 lg-mt-30">
            <Link
              href="/job-search"
              className="btn-six fw-500"
              style={{
                backgroundColor: '#00BF63',
                color: 'white',
                padding: '15px 35px',
                borderRadius: '50px',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#00A555';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#00BF63';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              Show More Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedJobs;
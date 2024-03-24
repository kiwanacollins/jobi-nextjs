import React from 'react';
import EmployJobItem from './job-item';
import EmployShortSelect from './short-select';
import { IJobData } from '@/database/job.model';
import { getTimestamp } from '@/utils/utils';
import CommonPagination from '../../common/CommonPagination';

interface IEmployJobAreaProps {
  jobs: IJobData[];
  totalJob: number;
  isNext: boolean;
  pageNumber: number;
}

const EmployJobArea = ({
  jobs,
  totalJob,
  isNext,
  pageNumber
}: IEmployJobAreaProps) => {
  return (
    <div className="position-relative">
      <div className="d-sm-flex align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 className="main-title m0">
          My Jobs
          {totalJob > 0 && (
            <span className="badge bg-primary ms-2">{totalJob}</span>
          )}
        </h2>
        <div className="d-flex ms-auto xs-mt-30">
          <div
            className="nav nav-tabs tab-filter-btn me-4"
            id="nav-tab"
            role="tablist"
          >
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#a1"
              type="button"
              role="tab"
              aria-selected="true"
            >
              All
            </button>
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#a2"
              type="button"
              role="tab"
              aria-selected="false"
            >
              New
            </button>
          </div>
          <div className="short-filter d-flex align-items-center ms-auto">
            <div className="text-dark fw-500 me-2">Short by:</div>
            <EmployShortSelect />
          </div>
        </div>
      </div>

      <div className="bg-white card-box border-20">
        <div className="tab-content" id="nav-tabContent">
          <div className="tab-pane fade show active" id="a1" role="tabpanel">
            <div className="table-responsive">
              <table className="table job-alert-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Job Created</th>

                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  {jobs?.map((job) => (
                    <EmployJobItem
                      key={job._id}
                      jobId={job._id}
                      title={job.title}
                      info={job.overview}
                      date={getTimestamp(job?.createAt as Date)}
                      status="active"
                    />
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No job post found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="tab-pane fade" id="a2" role="tabpanel">
            <div className="table-responsive">
              <table className="table job-alert-table">
                <thead>
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Job Created</th>
                    <th scope="col">Applicants</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="border-0">
                  <EmployJobItem
                    title="Marketing Specialist"
                    info="Part-time . Uk"
                    date="13 Aug, 2023"
                    status="pending"
                  />
                  <EmployJobItem
                    title="Brand & Producr Designer"
                    info="Fulltime . Spain"
                    date="05 Jun, 2023"
                    status="active"
                  />
                  <EmployJobItem
                    title="Developer for IT company"
                    info="Fulltime . Germany"
                    date="14 Feb, 2023"
                    status="active"
                  />

                  <EmployJobItem
                    title="Accounting Manager"
                    info="Fulltime . USA"
                    date="27 Sep, 2023"
                    status="expired"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-pagination d-flex justify-content-end mt-30">
        <CommonPagination isNext={isNext} pageNumber={pageNumber} />
      </div>
    </div>
  );
};

export default EmployJobArea;

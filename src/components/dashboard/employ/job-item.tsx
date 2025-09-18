import React from 'react';
import JobActionDropdown from './JobActionDropdown';
import ParseHTML from '../../common/parseHTML';
import { IJobData } from '@/database/job.model';

interface IEmployJobItemProps {
  title: string;
  info: string;
  date: string;
  createdBy: any;
  status: string;
  job: IJobData;
  jobId?: string | undefined; // Keep for backward compatibility
}

const EmployJobItem = ({
  title,
  info,
  date,
  status,
  job,
  jobId,
  createdBy
}: IEmployJobItemProps) => {
  return (
    <tr className={status}>
      <td>
        <div className="job-name fw-500">{title}</div>
        <div className="info1 d-none d-lg-block w-50">
          <ParseHTML
            data={info.length > 70 ? info.slice(0, 70) + '...' : info}
          />
        </div>
      </td>
      <td>{date}</td>

      <td>
        <div className="job-status text-capitalize">{status}</div>
      </td>
      <td>
        <div className="action-dots float-end">
          <button
            className="action-btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span></span>
          </button>
          {/* action dropdown start */}
          <JobActionDropdown job={job} createdBy={createdBy._id} jobId={jobId || job._id} />
          {/* action dropdown end */}
        </div>
      </td>
    </tr>
  );
};

export default EmployJobItem;

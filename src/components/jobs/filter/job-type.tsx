'use client';
import React from 'react';
// import job_data from '@/data/job-data';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setJobType } from '@/redux/features/filterSlice';
import { IJobData } from '@/database/job.model';

// job type items

export function JobTypeItems({
  showLength = true,
  allJobs
}: {
  showLength?: boolean;
  allJobs?: IJobData[];
}) {
  const jobDuration = [...new Set(allJobs?.map((job) => job.duration))];
  const { job_type } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   const getAllJobs = async () => {
  //     const { jobs } = await getJobPosts({});
  //     setAllJobData(jobs);
  //   };
  //   getAllJobs();
  // }, []);
  return (
    <>
      {jobDuration.map((duration, index) => (
        <li key={index}>
          <input
            onChange={() => dispatch(setJobType(duration))}
            type="checkbox"
            name="JobType"
            defaultValue={duration}
            checked={job_type.includes(duration)}
          />
          <label>
            {duration}{' '}
            {showLength && (
              <span>
                {allJobs?.filter((job) => job.duration === duration).length}
              </span>
            )}
          </label>
        </li>
      ))}
    </>
  );
}

const JobType = ({ allJobs }: { allJobs: IJobData[] }) => {
  return (
    <div className="main-body">
      <ul className="style-none filter-input">
        <JobTypeItems allJobs={allJobs} />
      </ul>
    </div>
  );
};

export default JobType;

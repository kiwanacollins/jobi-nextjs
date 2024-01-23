'use client';
import React, { useEffect, useState } from 'react';
// import job_data from '@/data/job-data';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setJobType } from '@/redux/features/filterSlice';
import { getJobPosts } from '@/lib/actions/job.action';
import { IJobData } from '@/database/job.model';

// job type items

export function JobTypeItems({ showLength = true }: { showLength?: boolean }) {
  const [allJobData, setAllJobData] = useState<IJobData[]>([]);
  const jobDuration = [...new Set(allJobData.map((job) => job.duration))];
  const { job_type } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getAllJobs = async () => {
      const { jobs } = await getJobPosts();
      setAllJobData(jobs);
    };
    getAllJobs();
  }, []);
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
                {allJobData.filter((job) => job.duration === duration).length}
              </span>
            )}
          </label>
        </li>
      ))}
    </>
  );
}

const JobType = () => {
  return (
    <div className="main-body">
      <ul className="style-none filter-input">
        <JobTypeItems />
      </ul>
    </div>
  );
};

export default JobType;

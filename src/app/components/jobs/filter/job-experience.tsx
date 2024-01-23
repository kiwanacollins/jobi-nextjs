'use client';
import React, { useEffect, useState } from 'react';
// import job_data from '@/data/job-data';
import { setExperience } from '@/redux/features/filterSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { IJobData } from '@/database/job.model';
import { getJobPosts } from '@/lib/actions/job.action';

export function JobExperienceItems({
  showLength = true
}: {
  showLength?: boolean;
}) {
  const [allJobData, setAllJobData] = useState<IJobData[]>([]);

  const uniqueExperiences = [
    ...new Set(allJobData.map((job) => job.experience))
  ];
  const { experience } = useAppSelector((state) => state.filter);
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
      {uniqueExperiences?.map((e, index) => (
        <li key={index}>
          <input
            onChange={() => dispatch(setExperience(e))}
            type="checkbox"
            name={e}
            defaultValue={e}
            checked={experience.includes(e)}
          />
          <label>
            {e}
            {showLength && (
              <span>
                {allJobData.filter((job) => job.experience === e).length}
              </span>
            )}
          </label>
        </li>
      ))}
    </>
  );
}

const JobExperience = () => {
  return (
    <>
      <div className="main-body">
        <ul className="style-none filter-input">
          <JobExperienceItems />
        </ul>
      </div>
    </>
  );
};

export default JobExperience;

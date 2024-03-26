'use client';
import React from 'react';
// import job_data from '@/data/job-data';
import { setExperience } from '@/redux/features/filterSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { IJobData } from '@/database/job.model';

export function JobExperienceItems({
  showLength = true,
  allJobs
}: {
  showLength?: boolean;
  allJobs: IJobData[];
}) {
  // const [allJobData, setAllJobData] = useState<IJobData[]>([]);
  const uniqueExperiences = [
    ...new Set(allJobs?.map((job) => job?.experience))
  ];
  const { experience } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

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
                {allJobs.filter((job) => job.experience === e).length}
              </span>
            )}
          </label>
        </li>
      ))}
    </>
  );
}

interface IProps {
  allJobs: IJobData[];
}

const JobExperience = ({ allJobs }: IProps) => {
  return (
    <>
      <div className="main-body">
        <ul className="style-none filter-input">
          <JobExperienceItems allJobs={allJobs} />
        </ul>
      </div>
    </>
  );
};

export default JobExperience;

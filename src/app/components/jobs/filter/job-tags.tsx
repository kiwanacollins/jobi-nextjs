'use client';
import React, { useState, useEffect } from 'react';
// import job_data from '@/data/job-data';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { setTags } from '@/redux/features/filterSlice';
import { IJobData } from '@/database/job.model';
import { getJobPosts } from '@/lib/actions/job.action';

const JobTags = () => {
  const [allJobData, setAllJobData] = useState<IJobData[]>([]);
  const uniqueTags = [...new Set(allJobData.flatMap((job) => job.skills))];
  const { skills } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getAllJobs = async () => {
      const { jobs } = await getJobPosts();
      setAllJobData(jobs);
    };
    getAllJobs();
  }, []);

  return (
    <div className="main-body">
      <ul className="style-none d-flex flex-wrap justify-space-between radio-filter mb-5">
        {uniqueTags.map((t, i) => (
          <li key={i}>
            <input
              onChange={() => dispatch(setTags(t as string))}
              type="checkbox"
              name="tags"
              defaultValue={t}
              checked={skills.includes(t as string)}
            />
            <label>{t}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobTags;

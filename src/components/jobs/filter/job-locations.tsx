'use client';
import React, { useEffect, useState } from 'react';
import slugify from 'slugify';
import NiceSelect from '@/ui/nice-select';
import { useAppDispatch } from '@/redux/hook';
import { setLocation } from '@/redux/features/filterSlice';
import { getJobPosts } from '@/lib/actions/job.action';
import { IJobData } from '@/database/job.model';

const JobLocations = () => {
  const [allJobData, setAllJobData] = useState<IJobData[]>([]);
  const uniqueLocations = [...new Set(allJobData.map((job) => job.location).filter((loc): loc is string => Boolean(loc)))];
  const dispatch = useAppDispatch();
  const handleLocation = (item: { value: string; label: string }) => {
    dispatch(setLocation(item.value));
  };
  const options: any = uniqueLocations.map((l) => {
    return {
      value: slugify(l.split(',').join('-').toLowerCase(), '-'),
      label: l
    };
  });
  useEffect(() => {
    const getAllJobs = async () => {
      const { jobs } = await getJobPosts({});
      setAllJobData(jobs);
    };
    getAllJobs();
  }, []);
  return (
    <NiceSelect
      options={options}
      defaultCurrent={1}
      onChange={(item) => handleLocation(item)}
      name="Location"
    />
  );
};

export default JobLocations;

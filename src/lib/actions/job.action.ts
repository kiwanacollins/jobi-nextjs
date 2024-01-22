'use server';

import { connectToDatabase } from '../mongoose';
import { CreateJobParams } from './shared.types';
import Job from '@/database/job.model';
import { revalidatePath } from 'next/cache';

export const creatJobPost = async (jobDataParams: CreateJobParams) => {
  try {
    connectToDatabase();
    const { createdBy, data, path, clerkId } = jobDataParams;
    const {
      title,
      category,
      english_fluency,
      overview,
      salaryRange,
      salary_duration,
      experience,
      tags,
      duration,
      location,
      address,
      city,
      state,
      country,
      minSalary,
      maxSalary,
      industry
    } = data;

    const newJob = await Job.create({
      clerkId,
      createdBy,
      title,
      category,
      english_fluency,
      overview,
      salaryRange,
      salary_duration,
      experience,
      duration,
      tags,
      location,
      address,
      city,
      state,
      country,
      minSalary,
      maxSalary,
      industry
    });

    revalidatePath(path);

    return { status: 'ok', newJob };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get all job posts
export const getJobPosts = async () => {
  try {
    connectToDatabase();
    const jobs = await Job.find({});
    return { status: 'ok', jobs };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

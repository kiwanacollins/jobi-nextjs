'use server';

import User from '@/database/user.model';
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
      salary_duration,
      experience,
      skills,
      duration,
      location,
      address,
      city,
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
      salary_duration,
      experience,
      duration,
      skills,
      location,
      address,
      city,
      country,
      minSalary,
      maxSalary,
      industry
    });

    // add new job to the user's job list
    await User.findByIdAndUpdate(createdBy, {
      $push: { jobPosts: newJob._id }
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
    return { status: 'ok', jobs: JSON.parse(JSON.stringify(jobs)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

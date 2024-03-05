'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { CreateJobParams } from './shared.types';
import Job, { IJobData } from '@/database/job.model';
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

// Update a single job by MongoDB ID
interface IUpdateJobParams {
  jobId: string;
  updateData: Partial<IJobData>;
  path: string;
}

export const updateJobById = async (params: IUpdateJobParams) => {
  const { jobId, updateData, path } = params;
  try {
    await connectToDatabase();
    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updateData },
      { new: true } // To return the updated document
    );

    if (!updatedJob) {
      return { status: 'error', message: 'Job not found' };
    }

    // Assuming createdBy field in Job model represents the user who created the job
    const { createdBy } = updatedJob;

    await User.findByIdAndUpdate(createdBy, {
      $push: { jobPosts: updatedJob._id }
    });

    revalidatePath(path);

    return { status: 'ok', updatedJob };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get all job posts
export const getJobPosts = async () => {
  try {
    await connectToDatabase();
    const jobs = await Job.find()
      .populate('createdBy', 'name picture')
      .sort({ createAt: -1 })
      .exec();
    return { status: 'ok', jobs: JSON.parse(JSON.stringify(jobs)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get jobs by mongoId
// Get a single job by MongoDB ID
export const getJobById = async (jobId: string) => {
  try {
    await connectToDatabase();
    const job = await Job.findById(jobId)
      .populate('createdBy', 'name picture website')
      .exec();

    if (!job) {
      return { status: 'error', message: 'Job not found' };
    }

    return { status: 'ok', job: JSON.parse(JSON.stringify(job)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

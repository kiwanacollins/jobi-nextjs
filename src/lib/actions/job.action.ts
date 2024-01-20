'use server';

import { connectToDatabase } from '../mongoose';
import { CreateJobParams } from './shared.types';
import Job from '@/database/job.model';
import { revalidatePath } from 'next/cache';

export async function creatJobPost(jobDataParams: CreateJobParams) {
  try {
    connectToDatabase();
    const { createdBy, data, path, clerkId } = jobDataParams;
    const {
      title,
      category,
      english_fluency,
      overview,
      salaryRange,
      salary,
      experience,
      tags,
      jobType,
      location,
      address,
      city,
      state,
      country,
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
      salary,
      experience,
      jobType,
      tags,
      location,
      address,
      city,
      state,
      country,

      industry
    });

    revalidatePath(path);

    return { status: 'ok', newJob };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

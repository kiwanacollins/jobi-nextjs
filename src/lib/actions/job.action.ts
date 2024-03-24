'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { CreateJobParams } from './shared.types';
import Job, { IJobData } from '@/database/job.model';
import { revalidatePath } from 'next/cache';
import Category from '@/database/category.model';
import { FilterQuery } from 'mongoose';

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

    if (category) {
      const mongoCategory = await Category.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(category, 'i')
          }
        },
        { $push: { job: newJob._id } },
        { new: true, upsert: true }
      );

      for (const subcategoryName of skills) {
        const matchingSubcategory = await mongoCategory.subcategory.find(
          (subcategory: any) => subcategory.name === subcategoryName
        );

        console.log('matchingSubcategory', matchingSubcategory);

        if (matchingSubcategory) {
          await Category.findByIdAndUpdate(
            mongoCategory._id,
            {
              $push: {
                'category.subcategory.$.job': newJob._id
              }
            },
            {
              new: true
            }
          );
        } else {
          // Handle case where subcategory doesn't exist within the category (optional)
          console.log(
            `Subcategory '${subcategoryName}' not found in category '${category.name}'.`
          );
        }
      }
    }

    // add new job to the user's job list
    await User.findByIdAndUpdate(createdBy, {
      $push: { jobPosts: newJob._id }
    });

    revalidatePath(path);

    return {
      success: true,
      message: 'Job post created successfully',
      newJob: JSON.parse(JSON.stringify(newJob))
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Update a single job by MongoDB ID
interface IUpdateJobParams {
  jobId: string;
  updateData: IJobData;
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
      return { error: true, message: 'Job post not found' };
    }

    if (updateData.category) {
      const mongoCategory = await Category.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(updateData.category, 'i')
          }
        },
        { $push: { job: updatedJob._id } },
        { new: true, upsert: true }
      );

      for (const subcategoryName of updateData?.skills ?? []) {
        const matchingSubcategory = await mongoCategory?.subcategory.find(
          (subcategory: any) => subcategory.name === subcategoryName
        );

        // console.log('matchingSubcategory', matchingSubcategory);

        if (matchingSubcategory) {
          await Category.findByIdAndUpdate(
            mongoCategory._id,
            {
              $push: {
                'category.subcategory.$.job': updatedJob._id
              }
            },
            {
              new: true
            }
          );
        } else {
          // Handle case where subcategory doesn't exist within the category (optional)
          console.log(
            `Subcategory '${subcategoryName}' not found in category '${updateData.category}'.`
          );
        }
      }
    }

    // Assuming createdBy field in Job model represents the user who created the job
    const { createdBy } = updatedJob;

    await User.findByIdAndUpdate(createdBy, {
      $push: { jobPosts: updatedJob._id }
    });

    revalidatePath(path);

    return {
      success: true,
      message: 'Job updated successfully',
      updatedJob: JSON.parse(JSON.stringify(updatedJob))
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// get all job posts

interface IJobDataParams {
  query?: string;
  category?: string;
}

export const getJobPosts = async (params: IJobDataParams) => {
  try {
    await connectToDatabase();
    const { category, query: searchQuery } = params;
    const query: FilterQuery<typeof Job> = {};
    if (searchQuery) {
      query.$or = [
        { category: { $regex: new RegExp(searchQuery, 'i') } },
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { experience: { $regex: new RegExp(searchQuery, 'i') } },
        { industry: { $regex: new RegExp(searchQuery, 'i') } },
        { duration: { $regex: new RegExp(searchQuery, 'i') } }
      ];
    }
    if (category) {
      query.$or = [
        { category: { $regex: new RegExp(category, 'i') } },
        { title: { $regex: new RegExp(category, 'i') } }
      ];
    }

    const jobs = await Job.find(query)
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

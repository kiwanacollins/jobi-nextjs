'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { CreateJobParams } from './shared.types';
import Job, { IJobData } from '@/database/job.model';
import { revalidatePath } from 'next/cache';
import Category from '@/database/category.model';
import { FilterQuery } from 'mongoose';
import { generateJobSlug } from '@/utils/utils';

// Generate unique slug by checking database for conflicts
const generateUniqueJobSlug = async (title: string, company?: string): Promise<string> => {
  const baseSlug = generateJobSlug(title, company);
  
  // Check if slug already exists
  let slug = baseSlug;
  let counter = 1;
  
  while (await Job.findOne({ slug }).exec()) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

export const creatJobPost = async (jobDataParams: CreateJobParams) => {
  try {
    connectToDatabase();
    const { createdBy, data, path, clerkId } = jobDataParams;
    const {
      title,
      company,
      companyImage,
      location,
      deadline,
      category,
      overview,
      duration,
      // Optional fields that might not be present
      english_fluency,
      salary_duration,
      experience,
      skills,
      address,
      city,
      country,
      minSalary,
      maxSalary,
      industry
    } = data;

    // Generate unique slug for SEO-friendly URLs
    const slug = await generateUniqueJobSlug(title, company);

    const newJob = await Job.create({
      clerkId,
      createdBy,
      title,
      slug,
      company,
      companyImage,
      location,
      deadline,
      category,
      overview,
      duration,
      // Only include optional fields if they exist
      ...(english_fluency && { english_fluency }),
      ...(salary_duration && { salary_duration }),
      ...(experience && { experience }),
      ...(skills && { skills }),
      ...(address && { address }),
      ...(city && { city }),
      ...(country && { country }),
      ...(minSalary && { minSalary }),
      ...(maxSalary && { maxSalary }),
      ...(industry && { industry })
    });

    if (!newJob) {
      return { error: true, message: 'Error creating Job post' };
    }

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

      // Only process skills if they exist
      if (skills && Array.isArray(skills)) {
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
              `Subcategory '${subcategoryName}' not found in category '${category}'.`
            );
          }
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
    
    // Check if jobId is a valid MongoDB ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { status: 'error', message: 'Invalid job ID format' };
    }
    
    const job = await Job.findById(jobId)
      .populate('createdBy', 'name picture website isAdmin')
      .exec();

    if (!job) {
      return { status: 'error', message: 'Job not found' };
    }

    return { status: 'ok', job: JSON.parse(JSON.stringify(job)) };
  } catch (error) {
    console.log(error);
    return { status: 'error', message: 'Error fetching job' };
  }
};

// Get a single job by slug (SEO-friendly URL)
export const getJobBySlug = async (slug: string) => {
  try {
    await connectToDatabase();
    
    if (!slug) {
      return { status: 'error', message: 'Invalid job slug' };
    }
    
    const job = await Job.findOne({ slug })
      .populate('createdBy', 'name picture website isAdmin')
      .exec();

    if (!job) {
      return { status: 'error', message: 'Job not found' };
    }

    return { status: 'ok', job: JSON.parse(JSON.stringify(job)) };
  } catch (error) {
    console.log(error);
    return { status: 'error', message: 'Error fetching job' };
  }
};

export interface getJobsByCompanyIdParams {
  companyId: string;
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: string;
}

export async function getJobsByCompanyId(params: getJobsByCompanyIdParams) {
  try {
    connectToDatabase();

    const {
      companyId,
      page = 1,
      pageSize = 8,
      query: searchQuery,
      sort
    } = params;

    const user = await User.findById(companyId);

    if (!user) {
      throw new Error('User not found');
    }

    // Calculcate the number of posts to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Job> = { createdBy: user._id };
    if (searchQuery) {
      query.$or = [
        { category: { $regex: new RegExp(searchQuery, 'i') } },
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { experience: { $regex: new RegExp(searchQuery, 'i') } },
        { industry: { $regex: new RegExp(searchQuery, 'i') } },
        { duration: { $regex: new RegExp(searchQuery, 'i') } }
      ];
    }

    let sortOptions = {};

    switch (sort) {
      case 'old':
        sortOptions = { createAt: 1 };
        break;

      case 'name':
        sortOptions = { title: 1 };
        break;

      case 'new':
        sortOptions = { createAt: -1 };
        break;

      default:
        sortOptions = { createAt: -1 };
        break;
    }

    const myJobPosts = await Job.find(query)
      .populate(
        'createdBy',
        'name email picture website companyName categories bio address country'
      )
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions);

    const totalJobPosts = await Job.countDocuments({ createdBy: user._id });
    const isNext = totalJobPosts > skipAmount + myJobPosts.length;

    return {
      jobs: JSON.parse(JSON.stringify(myJobPosts)),
      totalJob: totalJobPosts,
      isNext
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Get related jobs based on category, excluding the current job
interface IRelatedJobsParams {
  currentJobId: string;
  category?: string;
  limit?: number;
}

export const getRelatedJobs = async (params: IRelatedJobsParams) => {
  try {
    await connectToDatabase();
    
    const { currentJobId, category, limit = 10 } = params;
    
    const query: FilterQuery<typeof Job> = {
      _id: { $ne: currentJobId } // Exclude current job
    };
    
    // If category is provided, prioritize jobs in the same category
    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }
    
    let relatedJobs = await Job.find(query)
      .populate('createdBy', 'name picture')
      .sort({ createAt: -1 })
      .limit(limit)
      .exec();
    
    // If we don't have enough jobs from the same category, get more from other categories
    if (relatedJobs.length < limit) {
      const remainingLimit = limit - relatedJobs.length;
      const additionalQuery: FilterQuery<typeof Job> = {
        _id: { 
          $ne: currentJobId,
          $nin: relatedJobs.map(job => job._id) // Exclude already fetched jobs
        }
      };
      
      if (category) {
        additionalQuery.category = { $not: { $regex: new RegExp(category, 'i') } };
      }
      
      const additionalJobs = await Job.find(additionalQuery)
        .populate('createdBy', 'name picture')
        .sort({ createAt: -1 })
        .limit(remainingLimit)
        .exec();
      
      relatedJobs = [...relatedJobs, ...additionalJobs];
    }
    
    return { 
      status: 'ok', 
      jobs: JSON.parse(JSON.stringify(relatedJobs)) 
    };
  } catch (error) {
    console.log(error);
    return { 
      status: 'error', 
      message: 'Error fetching related jobs',
      jobs: [] 
    };
  }
};

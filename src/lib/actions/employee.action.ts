'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '../mongoose';
import { UpdateUserParams } from './shared.types';
import User from '@/database/user.model';
import { clerkClient } from '@clerk/nextjs/server';
import Job from '@/database/job.model';
import ShareData from '@/database/shareData.model';
import { FilterQuery } from 'mongoose';
// update user
export async function createEmployeeProfileByUpdating(
  params: UpdateUserParams
) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    if (clerkId) {
      updateData.role = 'employee';
    }

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    });

    console.log('updatedUser', updatedUser);

    const clerkUser = await clerkClient.users.getUser(clerkId as string);
    // If the user doesn't have a role, set it to user
    if (!clerkUser.privateMetadata.role) {
      await clerkClient.users.updateUserMetadata(clerkId as string, {
        privateMetadata: {
          role: 'employee'
        }
      });
    }
    if (!updatedUser) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }
    revalidatePath(path);

    return JSON.parse(
      JSON.stringify({
        status: 'ok',
        message: 'User updated successfully',
        data: updatedUser
      })
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export interface getEmployeeByIdParams {
  userId: string;
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: string;
}

export async function getEmployeeJobPosts(params: getEmployeeByIdParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 8, query: searchQuery, sort } = params;

    const user = await User.findOne({ clerkId: userId });

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
      .populate('createdBy', 'name email picture')
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

interface IDeleteEmployeeJobPostParams {
  jobId: string | undefined;
  path: string;
}

export async function deleteEmployeeJobPost(
  params: IDeleteEmployeeJobPostParams
) {
  const { jobId, path } = params;
  try {
    await connectToDatabase();
    // Find the job post
    const jobPost = await Job.findByIdAndDelete(jobId);

    if (!jobPost) {
      throw new Error('Job post not found');
    }

    // Remove the job post reference from the user model
    const user = await User.findById(jobPost.createdBy);

    if (!user) {
      throw new Error('User not found');
    }

    user.jobPosts.pull(jobId); // Assuming 'jobPosts' is the name of the array field in the User model
    await user.save();

    revalidatePath(path);
    return { status: 'ok', message: 'Job post deleted successfully' };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface ToggleSaveCandidatesParams {
  userId: string | null;
  candidateId: string;
  path: string;
}

export async function toggleSaveCandidate(params: ToggleSaveCandidatesParams) {
  try {
    await connectToDatabase();

    const { userId, candidateId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isCandidateSaved = user.saved.includes(candidateId);

    if (isCandidateSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: candidateId } },
        { new: true }
      );
      revalidatePath(path);
      return { status: 'removed', message: 'Candidate removed from saved' };
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: candidateId } },
        { new: true }
      );
      revalidatePath(path);
      return { status: 'added', message: 'Candidate saved successfully' };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface IGetSavedCandidateParams {
  clerkId: string;
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function getSavedCandidates(params: IGetSavedCandidateParams) {
  try {
    connectToDatabase();

    const { clerkId, query: searchQuery } = params;

    // const skipAmount =  (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery as string, 'i') } },
        { post: { $regex: new RegExp(searchQuery as string, 'i') } },
        {
          qualification: { $regex: new RegExp(searchQuery as string, 'i') }
        },
        {
          post: { $regex: new RegExp(searchQuery as string, 'i') }
        },
        {
          skills: { $elemMatch: { $regex: new RegExp(searchQuery, 'i') } }
        },
        {
          gender: { $eq: searchQuery }
        }
      ];
    }

    const user = await User.findOne({ clerkId }).populate({
      path: 'saved',
      match: query
      // options:{
      //   limit:pageSize,
      //   skip:skipAmount
      // }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const savedCandidates = user.saved;

    return {
      candidates: JSON.parse(JSON.stringify(savedCandidates))
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface IShareSavedCandidatesParams {
  employeeId: string;
}

export async function shareSavedCandidates(
  params: IShareSavedCandidatesParams
) {
  try {
    connectToDatabase();

    const { employeeId } = params;

    const user = await User.findOne({ clerkId: employeeId }).populate('saved');

    if (!user) {
      throw new Error('User not found');
    }
    const SavedInfo = await ShareData.findOneAndUpdate(
      { employeeId: user._id },
      {
        $set: {
          employeeId: user._id,
          candidates: user.saved
        }
      },
      { new: true, upsert: true }
    );
    if (!SavedInfo) {
      throw new Error('Failed to share candidates');
    }
    console.log('SavedInfo', SavedInfo);

    return {
      success: true,
      message: 'Candidates shared successfully',
      data: JSON.parse(JSON.stringify(SavedInfo))
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getEmployeeStatisticsByClerkId({
  clerkId
}: {
  clerkId: string;
}) {
  try {
    // Step 1: Find the employee by clerkId
    const employee = await User.findOne({ clerkId });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // Step 2: Count the total posted jobs
    const totalPostedJobs = await Job.countDocuments({
      createdBy: employee._id
    });

    // Step 3: Aggregate the total jobs by category
    const totalJobsByCategory = await Job.aggregate([
      { $match: { createdBy: employee._id } },
      { $group: { _id: '$category', totalJobs: { $sum: 1 } } }
    ]);

    // Step 4: Aggregate the total jobs by skills
    const totalJobsBySkills = await Job.aggregate([
      { $match: { createdBy: employee._id } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', totalJobs: { $sum: 1 } } }
    ]);
    // Step 5: Count the total saved users
    const totalSavedUsers = employee.saved.length;

    return {
      // employee: JSON.parse(JSON.stringify(employee)),
      totalPostedJobs,
      totalJobsByCategory: JSON.parse(JSON.stringify(totalJobsByCategory)),
      totalJobsBySkills: JSON.parse(JSON.stringify(totalJobsBySkills)),
      totalSavedUsers
    };
  } catch (error) {
    console.error(error);
  }
}

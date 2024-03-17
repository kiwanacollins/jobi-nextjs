'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '../mongoose';
import { UpdateUserParams } from './shared.types';
import User from '@/database/user.model';
import { clerkClient } from '@clerk/nextjs/server';
import Job from '@/database/job.model';
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
}

export async function getEmployeeJobPosts(params: getEmployeeByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const myJobPosts = await Job.find({ createdBy: user._id }).populate(
      'createdBy',
      'name email picture'
    );
    const totalJobPosts = myJobPosts.length;

    return {
      jobs: JSON.parse(JSON.stringify(myJobPosts)),
      totalJob: totalJobPosts
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
}

export async function getSavedCandidates(params: IGetSavedCandidateParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOne({ clerkId }).populate('saved');

    if (!user) {
      throw new Error('User not found');
    }
    const savedCandidates = user.saved;

    return { candidates: JSON.parse(JSON.stringify(savedCandidates)) };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

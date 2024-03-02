'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '../mongoose';
import { UpdateUserParams } from './shared.types';
import { updateUser } from './user.action';
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

    console.log('updatedUser', updateUser);

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

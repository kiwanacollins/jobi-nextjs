'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { CreateUserParams, UpdateUserParams } from './shared.types';
import { revalidatePath } from 'next/cache';
import { clerkClient } from '@clerk/nextjs';

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const { clerkId } = userData;
    const clerkUser = await clerkClient.users.getUser(clerkId);
    console.log('createUser  clerkUser:', clerkUser);
    if (!clerkUser) {
      throw new Error('User not found');
    }
    const userRole = clerkUser.unsafeMetadata.userRole;
    console.log('createUser  userRole:', userRole);

    const mongoUser = { ...userData, userRole };

    console.log('createUser  mongoUser:', mongoUser);
    const newUser = await User.create(mongoUser);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// update user

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

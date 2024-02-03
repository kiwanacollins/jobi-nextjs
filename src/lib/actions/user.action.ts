'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  ClerkUpdateUserParams,
  CreateUserParams,
  UpdateUserParams
} from './shared.types';
import { revalidatePath } from 'next/cache';

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
    const { clerkId, name, email, picture, username, role } = userData;
    console.log({
      clerkId,
      name,
      email,
      picture,
      username,
      role
    });
    const newUser = await User.create({
      clerkId,
      name,
      email,
      picture,
      username,
      role
    });
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
    console.log('updateUser  updateData:', updateData);

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    });
    console.log('updatedUser:', updatedUser);
    if (!updatedUser) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
// update user

export async function clekUserUpdate(params: ClerkUpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, name, email, picture, username, path } = params;

    const updateData = {
      clerkId,
      name,
      email,
      picture,
      username
    };
    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    });
    if (!updatedUser) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

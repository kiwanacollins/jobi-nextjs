'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import { CreateUserParams, UpdateUserParams } from './shared.types';
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
    const { clerkId, name, email, picture, username } = userData;
    console.log({
      clerkId,
      name,
      email,
      picture,
      username
    });
    const newUser = await User.create({
      clerkId,
      name,
      email,
      picture,
      username
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

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

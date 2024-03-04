'use server';

import Category from '@/database/categery.model';
import User from '@/database/user.model';
import { clerkClient } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '../mongoose';

interface ICreateCategory {
  skills: string[];
  path: string;
}

export async function createCategory(params: ICreateCategory) {
  const { skills, path } = params;

  const skillDocument = [];

  // Create the skills or get them if they already exist
  for (const skill of skills) {
    const existingskill = await Category.findOneAndUpdate(
      { value: { $regex: new RegExp(`^${skill}$`, 'i') } },
      { $setOnInsert: { value: skill } },
      { upsert: true, new: true }
    );
    skillDocument.push(existingskill._id);
  }
  revalidatePath(path);
}

export async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Category.find();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.log('Error getting categories:', error);
  }
}

export async function deleteSingleCategory(param: {
  mongoId: string;
  path: string;
}) {
  const { mongoId, path } = param;
  try {
    await connectToDatabase();
    const result = await Category.findByIdAndDelete(mongoId);

    if (result) {
      revalidatePath(path);
      return { success: true, message: 'Category deleted successfully' };
    } else {
      return {
        success: false,
        message: `Category with ID: ${mongoId} not found`
      };
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error; // Re-throw to allow for error handling in calling code
  }
}

interface ImakeAdminProps {
  email: string;
  path: string;
}
export async function makeUserAdmin(params: ImakeAdminProps) {
  const { email, path } = params;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }

  if (user?.clerkId) {
    user.isAdmin = true;
    await user.save();
    const clerkUser = await clerkClient.users.getUser(user.clerkId as string);
    if (!clerkUser.privateMetadata.isAdmin) {
      await clerkClient.users.updateUserMetadata(user.clerkId as string, {
        privateMetadata: {
          isAdmin: true
        }
      });
    }
  }
  revalidatePath(path);
  return JSON.parse(JSON.stringify(user));
}

export async function getAdmins() {
  try {
    await connectToDatabase();
    const admins = await User.find(
      { isAdmin: true },
      { _id: 1, isAdmin: 1, name: 1, email: 1 }
    );
    return JSON.parse(JSON.stringify(admins));
  } catch (error) {
    console.log('Error getting admins:', error);
  }
}

interface IRemoveAdminProps {
  userId: string;
  path: string;
}

export async function removeFromAdmin(params: IRemoveAdminProps) {
  const { userId, path } = params;
  try {
    await connectToDatabase();

    const isAdmin = await User.findOne({ _id: userId, isAdmin: true });
    if (!isAdmin) {
      // Handle user not being an admin gracefully
      console.log(`User with ID ${userId} is not an admin.`);
      return;
    }

    // Set isAdmin to false, preserving data integrity
    await User.updateOne({ _id: userId }, { isAdmin: false });

    revalidatePath(path);
  } catch (error) {
    console.error('Error removing user from admin:', error);
  }
}

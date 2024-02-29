'use server';

import Category from '@/database/categery.model';
import User from '@/database/user.model';
import { clerkClient } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

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
  const categories = await Category.find();
  return JSON.parse(JSON.stringify(categories));
}

interface ImakeAdminProps {
  email: string;
}
export async function makeUserAdmin(params: ImakeAdminProps) {
  const { email } = params;
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
  console.log('user', user);
}

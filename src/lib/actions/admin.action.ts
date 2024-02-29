'use server';

import Category from '@/database/categery.model';
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

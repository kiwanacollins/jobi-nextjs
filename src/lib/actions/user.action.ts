'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  ClerkUpdateUserParams,
  CreateUserParams,
  DeleteUserParams,
  UpdateUserByAdminParams,
  UpdateUserParams
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Resume from '@/database/resume.model';
import connectToCloudinary from '../cloudinary';
import cloudinary from 'cloudinary';

import { clerkClient } from '@clerk/nextjs';
import Category from '@/database/category.model';

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserByMongoId(params: any) {
  try {
    connectToDatabase();

    const { id } = params;

    const user = await User.findById(id);

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// type createUserByAdminParams = z.infer<typeof userSchema>;
export async function createUserByAdmin(userData: any) {
  try {
    connectToDatabase();
    connectToCloudinary();
    const { picture } = userData;

    if (picture) {
      const result = await cloudinary.v2.uploader.upload(picture as string, {
        folder: 'users',
        unique_filename: false,
        use_filename: true
      });

      userData.picture = result.secure_url;
    }
    const newUser = await User.create(userData);

    if (userData.post) {
      const category = await Category.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(userData.post, 'i')
          }
        },
        { $push: { candidates: newUser._id } },
        { new: true, upsert: true }
      );
      console.log('category', category);

      for (const subcategoryName of userData.skills) {
        const matchingSubcategory = category.subcategory.find(
          (subcategory: any) => subcategory.name === subcategoryName
        );

        console.log('matchingSubcategory', matchingSubcategory);

        if (matchingSubcategory) {
          await Category.findByIdAndUpdate(
            category._id,
            {
              $push: {
                'category.subcategory.$.candidates': newUser._id
              }
            },
            {
              new: true
            }
          );
        } else {
          // Handle case where subcategory doesn't exist within the category (optional)
          console.log(
            `Subcategory '${subcategoryName}' not found in category '${category.name}'.`
          );
        }
      }
    }

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// update user

export async function updateUserByAdmin(params: UpdateUserByAdminParams) {
  try {
    connectToDatabase();
    connectToCloudinary();
    const { mongoId, updateData, path } = params;
    const { picture } = updateData;

    if (picture) {
      const result = await cloudinary.v2.uploader.upload(picture as string, {
        folder: 'users',
        unique_filename: false,
        use_filename: true
      });

      updateData.picture = result.secure_url;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: mongoId },
      updateData,
      {
        new: true
      }
    );
    console.log('updatedUser', updateUser);

    if (!updatedUser) {
      throw new Error(`User with Id ${mongoId} not found`);
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// update user
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    connectToCloudinary();
    const { clerkId, updateData, path } = params;
    const { picture } = updateData;

    if (picture) {
      const result = await cloudinary.v2.uploader.upload(picture as string, {
        folder: 'users',
        unique_filename: false,
        use_filename: true
      });

      updateData.picture = result.secure_url;
    }

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true
    });
    console.log('updatedUser', updateUser);

    if (!updatedUser) {
      throw new Error(`User with clerkId ${clerkId} not found`);
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// update clerk user

export async function clekUserUpdate(params: ClerkUpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, name, email, picture, path } = params;

    const updateData = {
      clerkId,
      name,
      email,
      picture
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

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // delete candidate resume
    await Resume.deleteMany({ user: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface DeleteUserByIdParams {
  id: string;
  path: string;
}

export async function deleteUserById(params: DeleteUserByIdParams) {
  try {
    connectToDatabase();
    const { id, path } = params;
    // Find the user with the specified ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.clerkId) {
      await clerkClient.users.deleteUser(user.clerkId);
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Rethrow to allow for further handling
  }
}

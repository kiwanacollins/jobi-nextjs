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
import ShareData from '@/database/shareData.model';
import { FilterQuery } from 'mongoose';
import { isAdminEmail } from '../admin-setup';

export async function getUserById(params: any) {
  try {
    await connectToDatabase();

    const { userId } = params;
    if (!userId) return null;

    let user = await User.findOne({ clerkId: userId });

    // If user does not exist in Mongo, attempt to fetch from Clerk and create/link
    if (!user) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);
        if (clerkUser) {
          const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
          if (primaryEmail) {
            // Check if user already exists by email (but without clerkId)
            const existingUser = await User.findOne({ email: primaryEmail.toLowerCase() });
            
            if (existingUser) {
              // Link existing user to Clerk ID
              user = await User.findByIdAndUpdate(
                existingUser._id,
                { clerkId: userId },
                { new: true }
              );
              console.log(`✅ Linked existing user ${primaryEmail} to Clerk ID`);
            } else {
              // Create new user
              const shouldBeAdmin = isAdminEmail(primaryEmail);
              user = await User.create({
                clerkId: userId,
                email: primaryEmail.toLowerCase(),
                name: clerkUser.firstName || clerkUser.username || primaryEmail.split('@')[0],
                isAdmin: shouldBeAdmin,
                role: shouldBeAdmin ? 'employee' : undefined,
                joinedAt: new Date()
              });
              if (shouldBeAdmin) {
                console.log(`✅ Auto-created & promoted ${primaryEmail} to admin`);
              } else {
                console.log(`✅ Auto-created user ${primaryEmail}`);
              }
            }
          }
        }
      } catch (e) {
        console.log('Could not auto-create/link user from Clerk:', e);
      }
    }

    if (!user) {
      return null;
    }

    // Ensure admin promotion if email now matches list
    if (!user.isAdmin && isAdminEmail(user.email)) {
      await User.findByIdAndUpdate(user._id, { isAdmin: true });
      user.isAdmin = true;
      console.log(`✅ Auto-promoted ${user.email} to admin during getUserById`);
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function getUserByMongoId(params: any) {
  try {
    await connectToDatabase();

    const { id } = params;

    const user = await User.findById(id);
    if (!user) {
      return {
        error: true,
        message: 'User not found'
      };
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();
    
    // Check if this email should be admin
    const shouldBeAdmin = isAdminEmail(userData.email);
    
    // Create user with admin privileges if email is in admin list
    const newUserData = {
      ...userData,
      isAdmin: shouldBeAdmin
    };
    
    const newUser = await User.create(newUserData);
    
    if (shouldBeAdmin) {
      console.log(`✅ Auto-promoted ${userData.email} to admin during user creation`);
    }
    
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// type createUserByAdminParams = z.infer<typeof userSchema>;
export async function createUserByAdmin(userData: any) {
  try {
    await connectToDatabase();
    await connectToCloudinary();
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

      for (const subcategoryName of userData.skills) {
        const matchingSubcategory = category.subcategory.find(
          (subcategory: any) => subcategory.name === subcategoryName
        );

        if (matchingSubcategory) {
          await Category.findOneAndUpdate(
            {
              _id: category._id,
              'subcategory.name': subcategoryName
            },
            {
              $addToSet: {
                'subcategory.$.candidates': newUser._id
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
    await connectToDatabase();
    await connectToCloudinary();
    const { mongoId, updateData, path } = params;
    const { picture } = updateData;

    const user = await User.findById(mongoId);

    if (picture !== user.picture) {
      const result = await cloudinary.v2.uploader.upload(picture as string, {
        folder: 'users',
        unique_filename: false,
        use_filename: true
      });

      updateData.picture = result.secure_url;
    } else {
      updateData.picture = user.picture;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: mongoId },
      updateData,
      {
        new: true
      }
    );

    if (!updatedUser) {
      return {
        error: true,
        message: `User with Id ${mongoId} not found`
      };
    }
    if (updateData.post) {
      const category = await Category.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(updateData.post, 'i')
          }
        },
        { $addToSet: { candidates: updatedUser._id } },
        { new: true, upsert: true }
      );

      for (const subcategoryName of updateData.skills) {
        const matchingSubcategory = category.subcategory.find(
          (subcategory: any) => subcategory.name === subcategoryName
        );

        if (matchingSubcategory) {
          await Category.findOneAndUpdate(
            {
              _id: category._id,
              'subcategory.name': subcategoryName
            },
            {
              $addToSet: {
                'subcategory.$.candidates': updatedUser._id
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
    revalidatePath(path);
    return {
      success: true,
      message: 'User updated successfully'
    };
  } catch (error) {
    console.log('update user error', error);
  }
}

// update user
export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();
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

    if (updateData.post) {
      const category = await Category.findOneAndUpdate(
        {
          name: {
            $regex: new RegExp(updateData.post, 'i')
          }
        },
        { $addToSet: { candidates: updatedUser._id } },
        { new: true, upsert: true }
      );

      for (const subcategoryName of updateData.skills) {
        const matchingSubcategory = category.subcategory.find(
          (subcategory: any) => subcategory.name === subcategoryName
        );

        if (matchingSubcategory) {
          await Category.findOneAndUpdate(
            category._id,
            {
              $addToSet: {
                'subcategory.$.candidates': updatedUser._id
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

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// update clerk user

export async function clekUserUpdate(params: ClerkUpdateUserParams) {
  try {
    await connectToDatabase();
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
    await connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // delete candidate resume
    await Resume.deleteMany({ user: user._id });
    await ShareData.deleteMany({ employeeId: user._id });

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
    await connectToDatabase();
    const { id, path } = params;
    // Find the user with the specified ID
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return {
        error: true,
        message: 'User not found'
      };
    }

    if (user.clerkId) {
      await clerkClient.users.deleteUser(user.clerkId);
    }

    revalidatePath(path);
    return {
      success: true,
      message: 'User deleted successfully',
      user: JSON.parse(JSON.stringify(user))
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Rethrow to allow for further handling
  }
}

interface I_GetAllCompaniesProps {
  keyword?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export const getCompanyWithJobCount = async (
  params: I_GetAllCompaniesProps
) => {
  try {
    await connectToDatabase();

    const { keyword: searchQuery, page = 1, pageSize = 8, sort } = params;

    // Calculate the number of posts to skip for pagination
    const skipAmount = (page - 1) * pageSize;

    // Search filter
    const matchQuery: FilterQuery<typeof User> = {
      role: 'employee'
    };

    if (searchQuery) {
      matchQuery.companyName = { $regex: new RegExp(searchQuery, 'i') }; // Case-insensitive search
    }

    // Sorting logic
    let sortOptions = {};

    switch (sort) {
      case 'new':
        sortOptions = { joinedAt: -1 };
        break;
      case 'old':
        sortOptions = { joinedAt: 1 };
        break;
      case 'name':
        sortOptions = { companyName: 1 };
        break;
      case 'jobs':
        sortOptions = { jobPostCount: -1 };
        break;
      case 'country':
        sortOptions = { country: 1 };
        break;
      default:
        sortOptions = { jobPostCount: -1 }; // Default sorting by name
        break;
    }

    // Aggregation pipeline
    const companies = await User.aggregate([
      { $match: matchQuery },
      {
        $project: {
          picture: 1,
          _id: 1,
          companyName: 1,
          country: 1,
          jobPostCount: { $size: { $ifNull: ['$jobPosts', []] } }
        }
      },
      { $sort: sortOptions }, // Apply sorting
      { $skip: skipAmount }, // Pagination
      { $limit: pageSize }
    ]);

    // Count total companies for pagination
    const totalCompanies = await User.countDocuments(matchQuery);
    const isNext = totalCompanies > skipAmount + companies.length;
    const totalCompanyCount = await User.countDocuments({
      role: 'employee'
    });

    return {
      companies: JSON.parse(JSON.stringify(companies)),
      totalCompanyCount,
      isNext
    };
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

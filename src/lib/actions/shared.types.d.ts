import { IUser } from '@/mongodb';
import { Schema } from 'mongoose';

export interface CreateUserParams {
  clerkId: string;
  name: string;
  email: string;
  picture: string;
}
export interface ClerkUpdateUserParams {
  clerkId: string;
  name: string;
  email: string;
  picture: string;
  path: string;
}

export interface CreateJobParams {
  clerkId: string | null | undefined;
  createdBy: Schema.Types.ObjectId | IUser;
  data: any;
  path: string;
}

export interface UpdateUserParams {
  clerkId: string | null | undefined;
  updateData: Partial<IUser>;
  path: string;
}
export interface UpdateUserByAdminParams {
  mongoId: string;
  updateData: Partial<IUser>;
  path: string;
}

export interface DeleteUserParams {
  clerkId: string;
}

export interface getCandidatesParams {
  keyword?: string;
  skill?: string;
  location?: string;
  min?: string;
  max?: string;
  qualification?: string;
  experience?: string;
  gender?: string;
  fluency?: string;
  duration?: string;
}

export interface UpdateCategoryParams {
  categoryId: string;
  name: string;
  image: {
    url: string;
    public_id?: string;
  };
  subcategories?: string[];
  path: string;
}

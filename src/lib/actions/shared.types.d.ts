import { IUser } from '@/mongodb';
import { Schema } from 'mongoose';

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string | null;
  email: string;
  picture: string;
}
export interface ClerkUpdateUserParams {
  clerkId: string;
  name: string;
  username: string | null;
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
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

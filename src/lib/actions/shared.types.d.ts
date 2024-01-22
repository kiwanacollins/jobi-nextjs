import { IJobData } from '@/database/job.model';
import { IUser } from '@/mongodb';

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string | null;
  email: string;
  picture: string;
  userRole: string;
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

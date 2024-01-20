import { IJobData } from '@/database/job.model';

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string | null;
  email: string;
  picture: string;
  userRole: string;
}

export interface CreateJobParams {
  clerkId: string;
  createdBy: Schema.Types.ObjectId | IUser;
  data: any;
  path: string;
}

import { Schema, models, model, Document } from 'mongoose';

interface I_Links {
  linkedin?: string;
  github?: string;
}

export interface IUser extends Document {
  clerkId?: string | undefined;
  name: string;
  companyName?: string;
  age?: number;
  email: string;
  companySize?: number;
  established: Date;
  categories?: string[];
  post?: string;
  bio?: string;
  gender?: string;
  website?: string;
  qualification?: string;
  minSalary?: number;
  maxSalary?: number;
  salary_duration?: string;
  experience?: string;
  english_fluency?: string;
  skills?: string[];
  phone?: string;
  picture?: string;
  role?: string;
  isHired?: boolean;
  isAdmin?: boolean;
  mediaLinks?: I_Links;
  address?: string;
  country?: string;
  saved?: Schema.Types.ObjectId[];
  appliedJobs?: Schema.Types.ObjectId[];
  resumeId?: Schema.Types.ObjectId | string;
  jobPosts?: Schema.Types.ObjectId[];
  joinedAt?: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  website: { type: String },
  companyName: { type: String },
  categories: [{ type: String }],
  bio: { type: String },
  post: { type: String },
  age: { type: Number },
  phone: { type: String },
  gender: { type: String },
  qualification: { type: String },
  english_fluency: { type: String },
  skills: [{ type: String }],
  minSalary: { type: Number },
  maxSalary: { type: Number },
  salary_duration: { type: String },
  experience: { type: String },
  picture: { type: String },
  role: { type: String },
  isHired: { type: Boolean },
  isAdmin: { type: Boolean },
  mediaLinks: {
    linkedin: { type: String },
    github: { type: String }
  },
  address: { type: String },
  country: { type: String },
  saved: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
  jobPosts: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  joinedAt: { type: Date, default: Date.now }
});

const User = models.User || model('User', UserSchema);

export default User;

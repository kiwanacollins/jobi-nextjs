import { Schema, models, model, Document } from 'mongoose';

interface I_Links {
  linkedin: string | undefined;
  github: string | undefined;
}

export interface IUser extends Document {
  clerkId?: string | undefined;
  name: string;
  username: string;
  age?: number;
  email: string;
  post?: string;
  bio?: string;
  gender?: string;
  qualification?: string;
  minSalary: number;
  maxSalary: number;
  salary_duration?: string;
  experience?: string;
  skills?: string[];
  phone?: string;
  picture?: string;
  role?: string;
  location?: string;
  mediaLinks?: I_Links;
  address?: string;
  country?: string;
  city?: string;
  street?: string;
  zip?: string;
  state?: string;
  mapLocation?: string;
  saved?: Schema.Types.ObjectId[];
  resumeId?: Schema.Types.ObjectId | string;
  joinedAt?: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String },
  name: { type: String, required: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  post: { type: String },
  age: { type: Number },
  phone: { type: String },
  gender: { type: String },
  qualification: { type: String },
  skills: [{ type: String }],
  minSalary: { type: Number },
  maxSalary: { type: Number },
  salary_duration: { type: String },
  experience: { type: String },
  picture: { type: String },
  role: { type: String },
  location: { type: String },
  mediaLinks: {
    linkedin: { type: String },
    github: { type: String }
  },
  address: { type: String },
  country: { type: String },
  city: { type: String },
  street: { type: String },
  zip: { type: String },
  state: { type: String },
  mapLocation: { type: String },
  saved: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
  joinedAt: { type: Date, default: Date.now }
});

const User = models.User || model('User', UserSchema);

export default User;

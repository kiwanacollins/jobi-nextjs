import { Schema, models, model, Document } from 'mongoose';

interface I_Links {
  linkedin: string;
  github: string;
}

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  gender?: string;
  phone?: string;
  picture: string;
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
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  phone: { type: String },
  gender: { type: String },
  picture: { type: String, required: true },
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

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
  password?: string;
  role: string;
  bio?: string;
  picture: string;
  location?: string;
  mediaLinks?: I_Links;
  address: string;
  country: string;
  city: string;
  street: string;
  zip: string;
  state: string;
  mapLocation?: string;
  saved?: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, required: true },
  bio: { type: String },
  picture: { type: String, required: true },
  location: { type: String },
  mediaLinks: {
    linkedin: { type: String },
    github: { type: String }
  },
  address: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  zip: { type: String, required: true },
  state: { type: String, required: true },
  mapLocation: { type: String },
  saved: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  joinedAt: { type: Date, default: Date.now }
});

const User = models.User || model('User', UserSchema);

export default User;

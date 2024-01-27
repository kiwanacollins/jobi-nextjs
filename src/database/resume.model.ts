import { Schema, models, model, Document } from 'mongoose';

export interface IEducation {
  title: string;
  academy: string;
  yearStart: number;
  yearEnd?: number;
  year?: string;
  description: string;
}

export interface IExperience {
  title: string;
  company: string;
  yearStart: number;
  yearEnd?: number;
  year?: string;
  description: string;
}

export interface IResumeType extends Document {
  clerkId: string;
  userId: Schema.Types.ObjectId | string;
  // filename: string;
  overview: string;
  // videos: string[];
  education: IEducation[];
  skills: string[];
  experience: IExperience[];
  // porftolio: string[];
}

const educationSchema = new Schema({
  title: String,
  academy: String,
  yearStart: Number,
  yearEnd: Number,
  year: String,
  description: String
});

const experienceSchema = new Schema({
  title: String,
  company: String,
  yearStart: Number,
  yearEnd: Number,
  year: String,
  description: String
});

const resumeSchema = new Schema({
  clerkId: {
    type: String,
    required: true
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  // filename: String, // Optional, uncomment if needed
  overview: String,
  // videos: [String], // Optional, uncomment if needed
  education: [educationSchema],
  skills: [String], // Adjust type if needed (e.g., [String])
  experience: [experienceSchema],
  // portfolio: [String], // Optional, uncomment if needed
  createdAt: { type: Date, default: Date.now }
});

const Resume = models.Resume || model('Resume', resumeSchema);

export default Resume;

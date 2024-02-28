import { Schema, models, model, Document } from 'mongoose';
import User from './user.model';

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

export interface IVideos {
  title?: string;
  videoId?: string;
}

export interface Iportfolio {
  imageUrl: string | undefined;
  public_id?: string | undefined;
}

export interface IResumeType extends Document {
  user: Schema.Types.ObjectId | string;
  overview: string;
  videos?: IVideos[];
  education: IEducation[];
  experience: IExperience[];
  portfolio?: Iportfolio[];
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
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  overview: String,
  videos: [{ title: String, videoId: String }],
  education: [educationSchema],
  skills: [{ type: String }],
  minSalary: { type: Number },
  maxSalary: { type: Number },
  experience: [experienceSchema],
  portfolio: [{ imageUrl: String, public_id: String }],
  createdAt: { type: Date, default: Date.now }
});

// Define a pre-save hook on the resume model
resumeSchema.pre('save', function (next) {
  const resume = this; // This refers to the current resume document
  // Find the associated user using the userId reference
  User.findById(resume.user)
    .then((user) => {
      if (!user) {
        return next(new Error('Associated user not found'));
      }
      // Copy minSalary and maxSalary from the user to the resume
      resume.minSalary = user.minSalary;
      resume.maxSalary = user.maxSalary;
      resume.skills = user.skills;
      next(); // Proceed with saving the resume
    })
    .catch((error) => next(error));
});

const Resume = models.Resume || model<IResumeType>('Resume', resumeSchema);

export default Resume;

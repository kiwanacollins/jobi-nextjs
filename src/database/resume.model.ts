import { Schema, models, model, Document } from 'mongoose';

interface IEducation {
  title: string;
  academy: string;
  startingYear: string;
  endingYear: string;
  year: string;
  description: string;
}

interface ISkills {
  skills: string;
}

interface IExperience {
  title: string;
  company: string;
  startingYear: string;
  endingYear: string;
  year: string;
  description: string;
}

export interface IResumeType extends Document {
  filename: string;
  overview: string;
  videos: string[];
  education: IEducation[];
  skills: ISkills[];
  experience: IExperience[];
  porftolio: string[];
}

const resumeSchema = new Schema({
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  filename: String,
  overview: String,
  videos: [String],
  education: [
    {
      title: String,
      academy: String,
      startingYear: String,
      endingYear: String, // Optional
      year: String, // Optional
      description: String
    }
  ],
  skills: [{ skills: [String] }], // Array of skills
  experience: [
    {
      title: String,
      company: String,
      startingYear: String,
      endingYear: String, // Optional
      year: String, // Optional
      description: String
    }
  ],
  portfolio: [String], // Array of photos
  createdAt: { type: Date, default: Date.now }
});

const Resume = models.Resume || model('Resume', resumeSchema);

export default Resume;

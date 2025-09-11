import { Schema, models, model, Document } from 'mongoose';

export interface IJobData extends Document {
  title: string;
  slug?: string;
  company?: string;
  companyImage?: string;
  location?: string;
  deadline?: Date;
  overview: string;
  duration: string;
  salary_duration?: string;
  category: string;
  country?: string;
  city?: string;
  skills?: string[];
  address?: string;
  experience?: string;
  minSalary?: number;
  maxSalary?: number;
  industry?: string;
  english_fluency?: string;
  createdBy?: Schema.Types.ObjectId | string;
  createAt?: Date;
  applicants?: Schema.Types.ObjectId[];
}

const jobSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  company: { type: String, required: true },
  companyImage: { type: String },
  location: { type: String, required: true },
  deadline: { type: Date, required: true },
  overview: { type: String, required: true },
  duration: { type: String, required: true },
  salary_duration: { type: String }, // Made optional
  category: { type: String, required: true },
  address: { type: String },
  country: { type: String },
  city: { type: String },
  skills: { type: [String] },
  experience: { type: String }, // Made optional
  minSalary: { type: Number },
  maxSalary: { type: Number },
  industry: { type: String },
  english_fluency: { type: String }, // Made optional
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming a User model
  createAt: { type: Date, default: Date.now },
  applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Assuming a User model
});

const Job = models.Job || model('Job', jobSchema);

export default Job;

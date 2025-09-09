import { Schema, models, model, Document } from 'mongoose';

export interface IJobData extends Document {
  title: string;
  company?: string;
  overview: string;
  duration: string;
  salary_duration?: string;
  category: string;
  location?: string;
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
  company: { type: String },
  overview: { type: String, required: true },
  duration: { type: String, required: true },
  salary_duration: { type: String }, // Made optional
  category: { type: String, required: true },
  location: { type: String }, // Made optional
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

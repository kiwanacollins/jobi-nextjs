import { Schema, models, model, Document } from 'mongoose';

// interface IAddress {
//   address?: string;
//   country?: string;
//   city?: string;
//   state?: string;
//   mapLocation?: string;
// }
export interface IJobData extends Document {
  title: string;
  company?: string;
  overview: string;
  duration: string;
  salary_duration: string;
  category: string;
  location: string;
  address?: {
    address?: string;
    country?: string;
    city?: string;
    state?: string;
    mapLocation?: string;
  };
  country: string;
  city: string;
  state: string;
  mapLocation?: string;
  tags?: string[];
  experience: string;
  salary: number;
  minSalary?: string;
  maxSalary?: string;
  industry: string;
  salaryRange: string;
  english_fluency: string;
  createdBy?: Schema.Types.ObjectId | string;
  createAt?: Date;
}

const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String },
  overview: { type: String, required: true },
  duration: { type: String, required: true },
  salary_duration: { type: String, required: true }, // Assuming salary is a number
  category: { type: [String], required: true },
  location: { type: String, required: true },
  address: {
    address: { type: String },
    country: { type: String },
    city: { type: String },
    state: { type: String },
    mapLocation: { type: String }
  },
  country: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  mapLocation: { type: String },
  tags: { type: [String] },
  experience: { type: String, required: true },
  salary: { type: Number, required: true },
  minSalary: { type: Number },
  maxSalary: { type: Number },
  industry: { type: String },
  salaryRange: { type: String },
  english_fluency: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming a User model
  createAt: { type: Date, default: Date.now }
});

const Job = models.Job || model('Job', jobSchema);

export default Job;

import { Schema, models, model, Document } from 'mongoose';
import { StaticImageData } from 'next/image';
import { string } from 'yup';

export interface IJobType extends Document {
  id: number;
  logo: string;
  title: string;
  duration: string;
  date: string;
  company: string;
  location: string;
  category: string[];
  tags?: string[];
  experience: string;
  salary: number;
  salary_duration: string;
  english_fluency: string;
  overview: string;
  creator: Schema.Types.ObjectId;
  createAt: Date;
}

const jobSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  logo: {
    type: string,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: [String],
    required: true
  },
  tags: {
    type: [String]
  },
  experience: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  salary_duration: {
    type: String,
    required: true
  },
  english_fluency: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const Job = models.Job || model('Job', jobSchema);

export default Job;

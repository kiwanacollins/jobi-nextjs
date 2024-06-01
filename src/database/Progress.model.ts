import { Schema, model, models, Document } from 'mongoose';

export interface UserProgressSchema extends Document {
  user: Schema.Types.ObjectId;
  clerkId: string;
  course: Schema.Types.ObjectId;
  completedModules: Schema.Types.ObjectId[];
  completedVideos: string[];
  progress: number;
  lastUpdated: Date;
}

const userProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  clerkId: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedModules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  completedVideos: [{ type: String }],
  progress: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Progress = models.Progress || model('Progress', userProgressSchema);

export default Progress;

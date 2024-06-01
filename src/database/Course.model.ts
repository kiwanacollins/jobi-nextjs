import { Schema, model, models, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  introVideo?: string;
  description: string;
  thumbnail: {
    url: string;
    public_id?: string;
  };
  modules?: Schema.Types.ObjectId | string;
  creator?: Schema.Types.ObjectId | string;
  enrolledUsers?: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: true
  },
  introVideo: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String
    }
  },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  enrolledUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Course = models.Course || model('Course', courseSchema);

export default Course;

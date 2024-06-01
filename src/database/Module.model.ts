import { Schema, model, models, Document } from 'mongoose';

export interface IContent {
  title: string;
  videoId: string;
}

// Interface for a module containing content items
export interface IModule extends Document {
  course: Schema.Types.ObjectId | string;
  title: string;
  content: IContent[];
}

const moduleSchema = new Schema<IModule>({
  course: { type: Schema.Types.ObjectId, ref: 'Course' },
  title: {
    type: String,
    required: true
  },
  content: [
    {
      title: {
        type: String
      },
      videoId: {
        type: String
      }
    }
  ]
});

const Module = models.Module || model('Module', moduleSchema);

export default Module;

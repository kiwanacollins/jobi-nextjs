import { Schema, model, models, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  image: {
    url: string;
    public_id?: string;
  };
  author?: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String
    }
  },
  author: {
    type: String
  },
  tags: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = models.Blog || model('Blog', blogSchema);

export default Blog;

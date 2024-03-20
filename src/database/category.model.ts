import { Schema, model, models, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  subcategory?: {
    name: string;
  }[];
  image: {
    url: string;
    public_id?: string;
  };
  createdOn?: Date;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  subcategory: [
    {
      name: { type: String, unique: true },
      candidates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      job: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
    }
  ],
  image: {
    url: { type: String, required: true },
    public_id: { type: String }
  },
  candidates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  job: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  createdOn: { type: Date, default: Date.now }
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;

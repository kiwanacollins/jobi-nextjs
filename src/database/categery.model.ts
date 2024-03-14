import { Schema, model, models, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  subcategory?: {
    name: string;
  }[];
  createdOn?: Date;
}

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  subcategory: [{ name: { type: String } }],
  createdOn: { type: Date, default: Date.now }
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;

import { Schema, model, models, Document } from 'mongoose';

export interface ICategory extends Document {
  value: string;
  createdOn?: Date;
}

const CategorySchema = new Schema({
  value: { type: String, required: true, unique: true },
  createdOn: { type: Date, default: Date.now }
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;

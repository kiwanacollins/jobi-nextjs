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
  name: { type: String, required: true, unique: true, trim: true },
  subcategory: [
    {
      name: { type: String, trim: true }, // Removed global unique index to avoid duplicate key errors on null
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

// Enforce uniqueness of subcategory names WITHIN a single category document (case-insensitive)
CategorySchema.pre('save', function (next) {
  try {
    if (this.subcategory && this.subcategory.length) {
      // Normalize names (ignore empty / null)
      const names = this.subcategory
        .filter((sc: any) => sc && sc.name && sc.name.trim() !== '')
        .map((sc: any) => sc.name.trim().toLowerCase());
      const seen = new Set<string>();
      for (const n of names) {
        if (seen.has(n)) {
          return next(new Error('Duplicate subcategory name within category: ' + n));
        }
        seen.add(n);
      }
    }
    next();
  } catch (err) {
    next(err as any);
  }
});

// Optional convenience: ensure updates using findOneAndUpdate also validate duplicate names
CategorySchema.pre('findOneAndUpdate', function (next) {
  try {
    const update: any = this.getUpdate();
    if (update && update.$set && update.$set.subcategory) {
      const subs = update.$set.subcategory;
      if (Array.isArray(subs)) {
        const names = subs
          .filter((sc: any) => sc && sc.name && sc.name.trim() !== '')
          .map((sc: any) => sc.name.trim().toLowerCase());
        const seen = new Set<string>();
        for (const n of names) {
          if (seen.has(n)) {
            return next(new Error('Duplicate subcategory name within category: ' + n));
          }
          seen.add(n);
        }
      }
    }
    next();
  } catch (err) {
    next(err as any);
  }
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;

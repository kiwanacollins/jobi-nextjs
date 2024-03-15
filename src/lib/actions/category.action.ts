'use server';

import Category from '@/database/category.model';
import { connectToDatabase } from '../mongoose';

export async function getCategoriesAndSubcategories() {
  try {
    await connectToDatabase();
    const data = await Category.find({});

    const categories = data.map((item: any) => item.name);

    const sizeOfCategories = data.map((item: any) => item.candidates.length);

    const subcategories = data.flatMap((item: any) =>
      item.subcategory.map((i: any) => i.name)
    );
    const uniqueSubcategories = [...new Set(subcategories)];

    return {
      categories: JSON.parse(JSON.stringify(categories)),
      subcategories: JSON.parse(JSON.stringify(uniqueSubcategories)),
      sizeOfCategories: JSON.parse(JSON.stringify(sizeOfCategories))
    };
  } catch (error) {
    console.log('Error getting categories:', error);
  }
}

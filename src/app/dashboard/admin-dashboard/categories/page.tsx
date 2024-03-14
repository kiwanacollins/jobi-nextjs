import CategoryForm from '@/app/components/dashboard/admin/category/CategoryForm';
import CategoriesTable from '@/app/components/dashboard/admin/category/CategoryTable';
import { getCategories } from '@/lib/actions/admin.action';
import React from 'react';
const AddCategoryPage = async () => {
  const categories = await getCategories();
  return (
    <>
      <h2 className="main-title">Add Categories</h2>
      <div className="py-2">
        <CategoryForm type="add" />
      </div>
      <CategoriesTable categories={categories} />
    </>
  );
};
export default AddCategoryPage;

import CategoryForm from '@/app/components/dashboard/admin/category/CategoryForm';
import CategoriesTable from '@/app/components/dashboard/admin/category/CategoryTable';
import React from 'react';
const AddCategoryPage = () => {
  return (
    <>
      <h2 className="main-title">Add Categories</h2>
      <div className="py-2">
        <CategoryForm type="add" />
      </div>
      <CategoriesTable categories={[]} />
    </>
  );
};
export default AddCategoryPage;

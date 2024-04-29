import CategoryForm from '@/components/dashboard/admin/category/CategoryForm';
import { getSingleCategoryById } from '@/lib/actions/admin.action';
import React from 'react';

interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}

const AddCategoryPage = async ({ params }: URLProps) => {
  const category = await getSingleCategoryById(params.id);
  return (
    <>
      <h2 className="main-title">Update Categories</h2>
      <div className="py-2">
        <CategoryForm category={category} type="edit" />
      </div>
    </>
  );
};
export default AddCategoryPage;

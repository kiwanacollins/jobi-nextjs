import React from 'react';
import CategoryForm from '@/components/dashboard/admin/category/CategoryForm';
import CategoriesTable from '@/components/dashboard/admin/category/CategoryTable';
import { getCategories } from '@/lib/actions/admin.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';

const AddCategoryPage = async () => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
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

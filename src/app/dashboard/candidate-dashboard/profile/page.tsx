import React from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import { getUserById, getUserByMongoId } from '@/lib/actions/user.action';
import UpdateUserArea from '@/components/dashboard/admin/candidates/UpdateUserArea';
import { getCategories } from '@/lib/actions/admin.action';

const CandidateProfilePage = async () => {
  const user = await currentUser();
  if (!user) {
    return redirect('/sign-in');
  }
  const loggedInUser = await getUserById({ userId: user?.id });
  if (loggedInUser.role !== 'candidate') {
    return redirect('/');
  }

  const mongoUser = await getUserByMongoId({ id: loggedInUser._id });
  const response = await getCategories();
  const categoriesData = response?.map((item: any) => ({
    value: item.name,
    label: item.name
  }));
  const subcategories = response?.flatMap((item: any) =>
    item.subcategory.map((i: any) => i.name)
  );
  const uniqueSubcategories = [...new Set(subcategories)];
  const subCategoryData = uniqueSubcategories?.map((item: any) => ({
    value: item as string,
    label: item as string
  }));

  return (
    <>
      <UpdateUserArea
        mongoUser={mongoUser}
        categories={response}
        categoryOptions={categoriesData}
        subCategories={subCategoryData}
      />
    </>
  );
};

export default CandidateProfilePage;

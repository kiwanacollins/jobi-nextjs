import UpdateUserArea from '@/components/dashboard/admin/candidates/UpdateUserArea';
import { getCategories } from '@/lib/actions/admin.action';
import { getUserById, getUserByMongoId } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface ParamsProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: ParamsProps) => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
    return redirect('/');
  }
  const mongoUser = await getUserByMongoId({ id: params.id });
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
export default Page;

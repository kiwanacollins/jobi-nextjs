import UpdateUserArea from '@/components/dashboard/admin/candidates/UpdateUserArea';
import { getCategories } from '@/lib/actions/admin.action';
import { getUserByMongoId } from '@/lib/actions/user.action';

interface ParamsProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: ParamsProps) => {
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

import CreateUserArea from '@/app/components/dashboard/admin/candidates/CreateUserArea';
import { getCategories } from '@/lib/actions/admin.action';

const Page = async () => {
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
      <CreateUserArea
        categories={response}
        categoryOptions={categoriesData}
        subCategories={subCategoryData}
      />
    </>
  );
};
export default Page;

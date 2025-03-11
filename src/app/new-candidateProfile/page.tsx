import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { getCategories } from '@/lib/actions/admin.action';
import CreateUserArea from '@/components/dashboard/admin/candidates/CreateUserArea';

const Page = async () => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
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
      <div className="container ">
        <div className="dashboard-body">
          <CreateUserArea
            categories={response}
            categoryOptions={categoriesData}
            subCategories={subCategoryData}
            mongoUser={mongoUser}
            isCandidate={true}
          />
        </div>
      </div>
    </>
  );
};
export default Page;

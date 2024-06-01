import ModuleNameForm from '@/components/Courses/ModuleForm';
import UpdateModuleForm from '@/components/Courses/UpdateModuleForm';
import { getModuleById } from '@/lib/actions/Course.action';
import { SearchParamsProps } from '@/types';

const Page = async ({ params }: SearchParamsProps) => {
  const { module } = await getModuleById(params?.id as string);
  return (
    <>
      <h2 className="main-title">Add Module Content</h2>
      {/* Add module start */}
      <UpdateModuleForm module={module} />
      {/* Add module end */}
    </>
  );
};
export default Page;

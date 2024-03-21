import CompanyBreadCrumb from '@/app/components/common/common-breadcrumb';
import CompanyDetailsArea from '@/app/components/company-details/company-details-area';
import { getSingleCompanySharedData } from '@/lib/actions/admin.action';
import { SearchParamsProps } from '@/types';

const EmployeeWishListPage = async ({ params }: SearchParamsProps) => {
  const { data } = await getSingleCompanySharedData(params?.id as string);
  return (
    <>
      {/*breadcrumb start */}
      <CompanyBreadCrumb
        title="Comany Wishlist"
        subtitle="Candiate details of saved wishlist."
      />
      {/*breadcrumb end */}
      {/* company details area start */}
      <CompanyDetailsArea
        company={data.employeeId}
        candidates={data.candidates}
      />
      {/* company details area end */}
    </>
  );
};
export default EmployeeWishListPage;

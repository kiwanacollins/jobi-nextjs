import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import CompanyBreadcrumb from '@/components/common/common-breadcrumb';
import CompanyV1Area from '@/components/company/company-v1-area';
import { getCompanyWithJobCount } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';

export const metadata: Metadata = {
  title: 'Company'
};

const CompanyPage = async ({ searchParams }: SearchParamsProps) => {
  const { companies, totalCompanyCount, isNext } = await getCompanyWithJobCount(
    {
      keyword: searchParams?.keyword,
      page: searchParams.page ? +searchParams.page : 1,
      sort: searchParams.sort
    }
  );
  return (
    <>
      {/*breadcrumb start */}
      <CompanyBreadcrumb
        title="Company"
        subtitle="Find your desire company and get your dream job"
      />
      {/*breadcrumb end */}

      {/* company v2 area start */}
      <CompanyV1Area
        companies={companies}
        totalCompany={totalCompanyCount}
        isNext={isNext}
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        style_2={true}
      />
      {/* company v2 area end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default CompanyPage;

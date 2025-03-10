import React from 'react';
import { Metadata } from 'next';
// import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import CompanyBreadcrumb from '@/components/common/common-breadcrumb';
import OpenPosition from '@/components/company-details/open-position';
import CompanyJobs from '@/components/company-details/company-jobs';
import { getJobsByCompanyId } from '@/lib/actions/job.action';

export const metadata: Metadata = {
  title: 'Company Details'
};

interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}

const CompanyDetailsPage = async ({ params }: URLProps) => {
  const { jobs } = await getJobsByCompanyId({
    companyId: params.id as string
  });
  console.log(jobs[0].createdBy);
  return (
    <>
      {/*breadcrumb start */}
      <CompanyBreadcrumb
        title="Company Details"
        subtitle="Find company details here"
      />
      {/*breadcrumb end */}

      {/* company details area start */}
      <CompanyJobs company={jobs[0].createdBy} candidates={[]} />
      {/* company details area end */}

      {/*job Open Position */}
      <OpenPosition jobs={jobs} />
      {/*job Open Position */}

      {/* job portal intro start */}
      {/* <JobPortalIntro top_border={true} /> */}
      {/* job portal intro end */}
    </>
  );
};

export default CompanyDetailsPage;

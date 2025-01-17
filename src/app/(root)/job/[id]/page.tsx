import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import JobDetailsV2Area from '@/components/job-details/job-details-v2-area';
import { getJobById } from '@/lib/actions/job.action';
import JobDetailsBreadcrumbTwo from '@/components/jobs/breadcrumb/job-details-breadcrumb-2';

export const metadata: Metadata = {
  title: 'Job Details - Jobi'
};

interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}

const JobDetailsV1Page = async ({ params }: URLProps) => {
  const { job } = await getJobById(params.id);
  return (
    <>
      {/* job details breadcrumb start */}
      <JobDetailsBreadcrumbTwo
        title={job?.title}
        company={job?.createdBy?.name as string}
        createdAt={job?.createAt as Date}
        website={job?.createdBy?.website as URL}
      />
      {/* job details breadcrumb end */}

      {/* job details area start */}
      <JobDetailsV2Area job={job} />
      {/* job details area end */}

      {/* job portal intro start */}
      <JobPortalIntro />
      {/* job portal intro end */}
    </>
  );
};

export default JobDetailsV1Page;

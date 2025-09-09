import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import JobDetailsV2Area from '@/components/job-details/job-details-v2-area';
import { getJobById } from '@/lib/actions/job.action';
import JobDetailsBreadcrumbTwo from '@/components/jobs/breadcrumb/job-details-breadcrumb-2';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Job Details - Jobi'
};

interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}

const JobDetailsV1Page = async ({ params }: URLProps) => {
  const result = await getJobById(params?.id);
  
  // Handle case where job is not found
  if (result.status === 'error' || !result.job) {
    notFound();
  }
  
  const { job } = result;
  
  return (
    <>
      {/* job details breadcrumb start */}
      <JobDetailsBreadcrumbTwo
        title={job?.title || 'Job Details'}
        company={job?.createdBy?.name as string || 'Company'}
        createdAt={job?.createAt as Date}
        website={job?.createdBy?.website as URL}
        createdBy={job?.createdBy?._id}
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

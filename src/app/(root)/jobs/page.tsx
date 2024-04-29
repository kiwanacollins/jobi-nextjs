import React from 'react';
import { Metadata } from 'next';
import JobBreadcrumb from '@/components/jobs/breadcrumb/job-breadcrumb';
import JobListThree from '@/components/jobs/list/job-list-three';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import { getJobPosts } from '@/lib/actions/job.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';

export const metadata: Metadata = {
  title: 'Jobs - OneSkill',
  description:
    'Explore a wide range of job opportunities on OneSkill. From tech to marketing, find your dream job and take the next step in your career. Your future starts here.'
};

const JobListOnePage = async ({ searchParams }: SearchParamsProps) => {
  const { jobs } = await getJobPosts({
    category: searchParams.category,
    query: searchParams.query
  });
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  return (
    <>
      {/* search breadcrumb start */}
      <JobBreadcrumb />
      {/* search breadcrumb end */}

      {/* job list three start */}
      <JobListThree
        allJobs={jobs}
        currentUser={JSON.parse(JSON.stringify(currentUser))}
        itemsPerPage={8}
      />
      {/* job list three end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default JobListOnePage;

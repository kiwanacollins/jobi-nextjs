import React from 'react';
import EmployJobArea from '@/components/dashboard/employ/job-area';
import { auth } from '@clerk/nextjs';
import { getEmployeeJobPosts } from '@/lib/actions/employee.action';
import { redirect } from 'next/navigation';
import { SearchParamsProps } from '@/types';
import { getUserById } from '@/lib/actions/user.action';

const EmployDashboardJobsPage = async ({ searchParams }: SearchParamsProps) => {
  const { userId: clerkId } = auth();
  const currentUser = await getUserById({ userId: clerkId });
  if (!clerkId || currentUser?.role !== 'employee') {
    redirect('/');
  }
  const { jobs, totalJob, isNext } = await getEmployeeJobPosts({
    userId: clerkId as string,
    page: searchParams.page ? +searchParams.page : 1,
    query: searchParams.query,
    sort: searchParams.sort
  });
  return (
    <>
      {/* job area start */}
      <EmployJobArea
        jobs={jobs}
        isNext={isNext}
        pageNumber={searchParams.page ? +searchParams.page : 1}
        totalJob={totalJob}
      />
      {/* job area end */}
    </>
  );
};

export default EmployDashboardJobsPage;

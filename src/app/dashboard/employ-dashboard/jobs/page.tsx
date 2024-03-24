import React from 'react';
import EmployJobArea from '@/app/components/dashboard/employ/job-area';
import { auth, currentUser } from '@clerk/nextjs';
import { getEmployeeJobPosts } from '@/lib/actions/employee.action';
import { redirect } from 'next/navigation';
import { SearchParamsProps } from '@/types';

const EmployDashboardJobsPage = async ({ searchParams }: SearchParamsProps) => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== 'employee') {
    return redirect('/');
  }
  const { userId: clerkId } = auth();
  const { jobs, totalJob, isNext } = await getEmployeeJobPosts({
    userId: clerkId as string,
    page: searchParams.page ? +searchParams.page : 1,
    query: searchParams.query
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

import React from 'react';
import EmployJobArea from '@/app/components/dashboard/employ/job-area';
import { auth, currentUser } from '@clerk/nextjs';
import { getEmployeeJobPosts } from '@/lib/actions/employee.action';
import { redirect } from 'next/navigation';

const EmployDashboardJobsPage = async () => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== 'employee') {
    return redirect('/');
  }
  const { userId: clerkId } = auth();
  const { jobs, totalJob } = await getEmployeeJobPosts({
    userId: clerkId as string
  });
  return (
    <>
      {/* job area start */}
      <EmployJobArea jobs={jobs} totalJob={totalJob} />
      {/* job area end */}
    </>
  );
};

export default EmployDashboardJobsPage;

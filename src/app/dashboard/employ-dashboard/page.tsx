import React from 'react';

import EmployDashboardArea from '@/components/dashboard/employ/dashboard-area';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import {
  getEmployeeJobPosts,
  getEmployeeStatisticsByClerkId
} from '@/lib/actions/employee.action';

const EmployDashboardPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }
  const { userId: clerkId } = auth();
  const { jobs, totalJob } = await getEmployeeJobPosts({
    userId: clerkId as string
  });
  const data = await getEmployeeStatisticsByClerkId({
    clerkId: clerkId as string
  });
  return (
    <>
      <EmployDashboardArea statistics={data} jobs={jobs} totalJob={totalJob} />
    </>
  );
};

export default EmployDashboardPage;

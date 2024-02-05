import React from 'react';

import EmployDashboardArea from '@/app/components/dashboard/employ/dashboard-area';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';

const EmployDashboardPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }
  return (
    <>
      <EmployDashboardArea />
    </>
  );
};

export default EmployDashboardPage;

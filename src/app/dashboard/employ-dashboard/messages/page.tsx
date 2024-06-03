import React from 'react';
import DashboardMessage from '@/components/dashboard/candidate/dashboard-message';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';

const EmployDashboardMessagesPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }
  return (
    <div>
      {/* messages area start */}
      <DashboardMessage />
      {/* messages area end */}
    </div>
  );
};

export default EmployDashboardMessagesPage;

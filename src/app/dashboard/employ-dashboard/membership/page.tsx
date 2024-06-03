import React from 'react';
import EmployMembershipArea from '@/components/dashboard/employ/membership-area';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';

const EmployDashboardMembershipPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }
  return (
    <>
      {/* membership area start */}
      <EmployMembershipArea />
      {/* membership area end */}
    </>
  );
};

export default EmployDashboardMembershipPage;

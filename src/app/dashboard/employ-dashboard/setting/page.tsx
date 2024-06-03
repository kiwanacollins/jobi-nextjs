import React from 'react';
import DashboardSettingArea from '@/components/dashboard/candidate/dashboard-setting';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';

const EmployDashboardSettingPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }
  return (
    <>
      {/* dashboard area start */}
      <DashboardSettingArea />
      {/* dashboard area end */}
    </>
  );
};

export default EmployDashboardSettingPage;

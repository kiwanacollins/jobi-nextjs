import React from 'react';
import DashboardSettingArea from '@/app/components/dashboard/candidate/dashboard-setting';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const EmployDashboardSettingPage = async () => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== 'employee') {
    return redirect('/');
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

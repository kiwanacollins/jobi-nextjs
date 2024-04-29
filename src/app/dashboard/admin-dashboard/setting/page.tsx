import React from 'react';
import DashboardSettingArea from '@/components/dashboard/candidate/dashboard-setting';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const EmployDashboardSettingPage = async () => {
  const user = await currentUser();
  if (!user || !user.privateMetadata.isAdmin) {
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

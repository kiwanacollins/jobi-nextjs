import React from 'react';
import DashboardSettingArea from '@/components/dashboard/candidate/dashboard-setting';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';

const CandidateDashboardSettingPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'candidate') {
    redirect('/');
  }
  return (
    <div className="main-page-wrapper">
      {/* setting area start */}
      <DashboardSettingArea />
      {/* setting area end */}
    </div>
  );
};

export default CandidateDashboardSettingPage;

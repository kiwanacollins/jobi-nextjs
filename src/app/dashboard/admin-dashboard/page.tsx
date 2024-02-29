import React from 'react';

import DashboardArea from '@/app/components/dashboard/candidate/dashboard-area';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AdminDashboardPage = async () => {
  const user = await currentUser();
  if (!user || user.privateMetadata.isAdmin !== 'true') {
    return redirect('/');
  }
  return (
    <>
      <DashboardArea />
    </>
  );
};

export default AdminDashboardPage;

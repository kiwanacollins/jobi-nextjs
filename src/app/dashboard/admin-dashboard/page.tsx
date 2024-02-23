import React from 'react';

import DashboardArea from '@/app/components/dashboard/candidate/dashboard-area';
// import { auth } from '@clerk/nextjs';
// import { getUserById } from '@/lib/actions/user.action';
// import { redirect } from 'next/navigation';

const AdminDashboardPage = async () => {
  // const { userId } = auth();
  // const currentUser = await getUserById({ userId });

  //   if (currentUser?.role !== 'admin') {
  //     redirect('/');
  //   }
  return (
    <>
      <DashboardArea />
    </>
  );
};

export default AdminDashboardPage;

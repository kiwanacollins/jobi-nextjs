import React from 'react';

import DashboardAdminMessages from '@/components/dashboard/admin/DashboardAdminMessages';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const AdminDashboardMessagesPage = async () => {
  const user = await currentUser();
  if (!user || !user.privateMetadata.isAdmin) {
    return redirect('/');
  }
  return (
    <>
      {/* messages area start */}
      <DashboardAdminMessages />
      {/* messages area end */}
    </>
  );
};

export default AdminDashboardMessagesPage;

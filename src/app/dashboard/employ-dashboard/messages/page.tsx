import React from 'react';
import DashboardMessage from '@/components/dashboard/candidate/dashboard-message';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const EmployDashboardMessagesPage = async () => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role === 'employee') {
    return redirect('/');
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

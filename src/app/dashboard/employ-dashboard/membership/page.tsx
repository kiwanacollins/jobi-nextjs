import React from 'react';
import EmployMembershipArea from '@/app/components/dashboard/employ/membership-area';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const EmployDashboardMembershipPage = async () => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== 'employee') {
    return redirect('/');
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

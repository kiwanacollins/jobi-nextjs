import React from 'react';
import DashboardResume from '@/app/components/dashboard/candidate/dashboard-resume';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';

const CandidateDashboardResumePage = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const mongoUser = await getUserById({ userId });
  return (
    <>
      {/* Resume area start */}
      <DashboardResume mongoUserId={mongoUser?._id.toString()} />
      {/* Resume area end */}
    </>
  );
};

export default CandidateDashboardResumePage;

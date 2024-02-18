import React from 'react';
import DashboardResume from '@/app/components/dashboard/candidate/dashboard-resume';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import { getResumeById } from '@/lib/actions/candidate.action';

const CandidateDashboardResumePage = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const mongoUser = await getUserById({ userId });
  const currentResume = await getResumeById(mongoUser?.resumeId || '');

  return (
    <>
      {/* Resume area start */}
      <DashboardResume resume={currentResume} mongoUser={mongoUser} />
      {/* Resume area end */}
    </>
  );
};

export default CandidateDashboardResumePage;

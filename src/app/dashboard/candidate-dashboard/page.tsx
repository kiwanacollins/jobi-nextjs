import React from 'react';

import { auth } from '@clerk/nextjs';

import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
import CandidateDashboardArea from '@/components/dashboard/candidate/CandidateDashboardArea';
import { getUserAppliedJobsCount } from '@/lib/actions/candidate.action';

const CandidateDashboardPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'candidate') {
    redirect('/');
  }
  const satistics = await getUserAppliedJobsCount(currentUser?._id);
  return (
    <>
      <CandidateDashboardArea statistics={satistics} />
    </>
  );
};

export default CandidateDashboardPage;

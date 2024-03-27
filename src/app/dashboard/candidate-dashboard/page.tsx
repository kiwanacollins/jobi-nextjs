import React from 'react';

import DashboardArea from '@/app/components/dashboard/candidate/dashboard-area';
import { auth } from '@clerk/nextjs';

import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';

const CandidateDashboardPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'candidate') {
    redirect('/');
  }
  return (
    <>
      <DashboardArea statistics={{}} />
    </>
  );
};

export default CandidateDashboardPage;

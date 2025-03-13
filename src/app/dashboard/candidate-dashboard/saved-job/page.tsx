import React from 'react';
import SavedJobArea from '@/components/dashboard/candidate/saved-job-area';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';

const CandidateDashboardSavedJobPage = async () => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'candidate') {
    redirect('/');
  }
  return (
    <>
      {/* saved job area start */}
      <SavedJobArea />
      {/* saved job area end */}
    </>
  );
};

export default CandidateDashboardSavedJobPage;

import React from 'react';
import SavedCandidateArea from '@/app/components/dashboard/employ/saved-candidate-area';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const EmployDashboardSavedCandidatePage = async () => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== 'employee') {
    return redirect('/');
  }
  return (
    <>
      {/* saved candidate area start */}
      <SavedCandidateArea />
      {/* saved candidate area end */}
    </>
  );
};

export default EmployDashboardSavedCandidatePage;

import React from 'react';
import SavedCandidateArea from '@/components/dashboard/employ/saved-candidate-area';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getSavedCandidates } from '@/lib/actions/employee.action';
import { getUserById } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';

const EmployDashboardSavedCandidatePage = async ({
  searchParams
}: SearchParamsProps) => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }

  const { candidates } = await getSavedCandidates({
    clerkId: userId as string,
    query: searchParams.query
  });

  return (
    <>
      {/* saved candidate area start */}
      <SavedCandidateArea loggedInUser={currentUser} candidates={candidates} />
      {/* saved candidate area end */}
    </>
  );
};

export default EmployDashboardSavedCandidatePage;

import React from 'react';
import DashboardProfileArea from '@/components/dashboard/candidate/dashboard-profile-area';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';

const CandidateProfilePage = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const mongoUser = await getUserById({ userId });

  return (
    <>
      {/* profile area start */}
      <DashboardProfileArea
        mongoUser={JSON.parse(JSON.stringify(mongoUser))}
        userId={userId}
      />
      {/* profile area end */}
    </>
  );
};

export default CandidateProfilePage;

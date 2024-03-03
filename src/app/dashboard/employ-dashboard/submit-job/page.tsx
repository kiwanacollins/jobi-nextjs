import React from 'react';
import SubmitJobArea from '@/app/components/dashboard/employ/submit-job-area';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';

const EmployDashboardSubmitJobPage = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const mongoUser = await getUserById({ userId });
  if (mongoUser?.role !== 'employee') {
    redirect('/');
  }

  return (
    <>
      {/* submit job area start */}
      <SubmitJobArea mongoUserId={mongoUser?._id.toString()} />
      {/* submit job area end */}
    </>
  );
};

export default EmployDashboardSubmitJobPage;

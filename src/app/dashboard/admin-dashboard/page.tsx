import React from 'react';
import DashboardArea from '@/app/components/dashboard/candidate/dashboard-area';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserStatistics } from '@/lib/actions/admin.action';
import { getAllCandidates } from '@/lib/actions/candidate.action';

const AdminDashboardPage = async () => {
  const user = await currentUser();
  if (!user || !user?.privateMetadata?.isAdmin) {
    return redirect('/');
  }
  const data = await getUserStatistics();
  const { candidates } = await getAllCandidates({});
  return (
    <>
      <DashboardArea candidates={candidates} statistics={data} />
    </>
  );
};

export default AdminDashboardPage;

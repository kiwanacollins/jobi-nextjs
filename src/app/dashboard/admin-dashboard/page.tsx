import React from 'react';
import DashboardArea from '@/components/dashboard/candidate/dashboard-area';

import { getUserStatistics } from '@/lib/actions/admin.action';
import { getAllCandidates } from '@/lib/actions/candidate.action';

const AdminDashboardPage = async () => {
  const data = await getUserStatistics();
  const { candidates } = await getAllCandidates({});
  return (
    <>
      <DashboardArea candidates={candidates} statistics={data} />
    </>
  );
};

export default AdminDashboardPage;

import React from 'react';

import DashboardMakeAdmin from '@/app/components/dashboard/admin/DashboardMakeAdmin';
import LoadingTableSkeleton from '@/app/components/skaletons/TableSkeleton';

const AdminDashboardMakeAdminPage = () => {
  return (
    <>
      <DashboardMakeAdmin />
      {/* Fetch Admin Data Start */}
      <LoadingTableSkeleton />
      {/* Fetch Admin Data End */}
    </>
  );
};

export default AdminDashboardMakeAdminPage;

import React from 'react';
import DashboardSettingArea from '@/components/dashboard/candidate/dashboard-setting';

const AdminDashboardSettingPage = async () => {
  // Admin check is handled by the layout
  return (
    <>
      {/* dashboard area start */}
      <DashboardSettingArea />
      {/* dashboard area end */}
    </>
  );
};

export default AdminDashboardSettingPage;

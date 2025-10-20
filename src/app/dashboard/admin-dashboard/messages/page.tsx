import React from 'react';
import DashboardAdminMessages from '@/components/dashboard/admin/DashboardAdminMessages';

interface Props {
  searchParams?: {
    page?: string;
    search?: string;
  };
}

const AdminDashboardMessagesPage = async ({ searchParams }: Props) => {
  // Admin check is handled by the layout
  return (
    <>
      {/* messages area start */}
      <DashboardAdminMessages searchParams={searchParams} />
      {/* messages area end */}
    </>
  );
};

export default AdminDashboardMessagesPage;

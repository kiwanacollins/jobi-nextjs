import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import DashboardMakeAdmin from '@/app/components/dashboard/admin/DashboardMakeAdmin';
import AdminsTable from '@/app/components/dashboard/admin/AdminsTable';
import { getAdmins } from '@/lib/actions/admin.action';
import { SearchParamsProps } from '@/types';

const AdminDashboardMakeAdminPage = async ({
  searchParams
}: SearchParamsProps) => {
  const user = await currentUser();
  if (!user || !user.privateMetadata.isAdmin) {
    return redirect('/');
  }
  const admins = await getAdmins({
    query: searchParams.query
  });

  return (
    <>
      <DashboardMakeAdmin />
      {/* Fetch Admin Data Start */}
      <AdminsTable admins={admins} />
      {/* Fetch Admin Data End */}
    </>
  );
};

export default AdminDashboardMakeAdminPage;

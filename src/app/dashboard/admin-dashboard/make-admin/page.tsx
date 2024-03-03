import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import DashboardMakeAdmin from '@/app/components/dashboard/admin/DashboardMakeAdmin';
import AdminsTable from '@/app/components/dashboard/admin/AdminsTable';
import { getAdmins } from '@/lib/actions/admin.action';

const AdminDashboardMakeAdminPage = async () => {
  const user = await currentUser();
  if (!user || !user.privateMetadata.isAdmin) {
    return redirect('/');
  }
  const admins = await getAdmins();
  console.log('AdminsTable  admins:', admins);
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

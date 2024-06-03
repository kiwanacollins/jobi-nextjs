import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import DashboardMakeAdmin from '@/components/dashboard/admin/DashboardMakeAdmin';
import AdminsTable from '@/components/dashboard/admin/AdminsTable';
import { getAdmins } from '@/lib/actions/admin.action';
import { SearchParamsProps } from '@/types';
import { getUserById } from '@/lib/actions/user.action';

const AdminDashboardMakeAdminPage = async ({
  searchParams
}: SearchParamsProps) => {
  const user = await currentUser();
  const loggedInUser = await getUserById({ userId: user?.id });
  if (!user || !loggedInUser.isAdmin) {
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

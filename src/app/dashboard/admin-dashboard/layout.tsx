import Wrapper from '@/layouts/wrapper';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
// import 'bootstrap/dist/js/bootstrap';
import NextTopLoader from 'nextjs-toploader';
import AdminDashboardLayoutContent from '@/components/dashboard/admin/AdminDashboardLayoutContent';

// if (typeof window !== 'undefined') {
//   require('bootstrap/dist/js/bootstrap');
// }
const AdminDashboardLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (!currentUser?.isAdmin) {
    redirect('/');
  }

  return (
    <Wrapper>
      <NextTopLoader showSpinner={false} />
      <AdminDashboardLayoutContent>{children}</AdminDashboardLayoutContent>
    </Wrapper>
  );
};
export default AdminDashboardLayout;

import EmployeDashboardLayoutContent from '@/app/components/dashboard/employ/EmployeDashboardLayoutContent';
import Wrapper from '@/layouts/wrapper';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
// import 'bootstrap/dist/js/bootstrap.bundle.js';
import React from 'react';

const EmployDashboardLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }

  return (
    <Wrapper>
      <NextTopLoader showSpinner={false} />
      <EmployeDashboardLayoutContent>{children}</EmployeDashboardLayoutContent>
    </Wrapper>
  );
};
export default EmployDashboardLayout;

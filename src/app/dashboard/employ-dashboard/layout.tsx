import EmployeDashboardLayoutContent from '@/components/dashboard/employ/EmployeDashboardLayoutContent';
import Wrapper from '@/layouts/wrapper';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
// import 'bootstrap/dist/js/bootstrap.bundle.js';
import React from 'react';

const EmployDashboardLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role === 'employee') {
    return redirect('/');
  }

  return (
    <Wrapper>
      <NextTopLoader showSpinner={false} />
      <EmployeDashboardLayoutContent>{children}</EmployeDashboardLayoutContent>
    </Wrapper>
  );
};
export default EmployDashboardLayout;

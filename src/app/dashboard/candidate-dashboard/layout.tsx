import Wrapper from '@/layouts/wrapper';
import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import CandidateDashboardLayoutContent from '@/components/dashboard/candidate/CandidateDashboardLayoutContent';
import NextTopLoader from 'nextjs-toploader';

const CandidateDashboardLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'candidate') {
    redirect('/');
  }
  return (
    <Wrapper>
      <NextTopLoader showSpinner={false} />
      <CandidateDashboardLayoutContent>
        {children}
      </CandidateDashboardLayoutContent>
    </Wrapper>
  );
};
export default CandidateDashboardLayout;

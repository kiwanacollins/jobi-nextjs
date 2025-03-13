import Wrapper from '@/layouts/wrapper';
import React from 'react';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CandidateDashboardLayoutContent from '@/components/dashboard/candidate/CandidateDashboardLayoutContent';
import NextTopLoader from 'nextjs-toploader';

const CandidateDashboardLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role === 'candidate') {
    return redirect('/');
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

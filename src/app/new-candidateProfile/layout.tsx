import React from 'react';
import CommonBreadcrumb from '@/components/common/common-breadcrumb';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role === 'candidate') {
    return redirect('/');
  }
  return (
    <div>
      <CommonBreadcrumb
        title="Create Candidate Profile"
        subtitle="Create your candidate profile and start applying for jobs."
      />
      {children}
    </div>
  );
};
export default Layout;

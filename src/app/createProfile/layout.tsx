import React from 'react';
import CommonBreadcrumb from '@/components/common/common-breadcrumb';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role === 'employee') {
    return redirect('/');
  }
  return (
    <div>
      <CommonBreadcrumb
        title="Create Employer Profile"
        subtitle="Create your employer profile and start hiring the best talent."
      />
      {children}
    </div>
  );
};
export default Layout;

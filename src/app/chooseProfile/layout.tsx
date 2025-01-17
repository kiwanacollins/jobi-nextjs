import React from 'react';
import CommonBreadcrumb from '@/components/common/common-breadcrumb';
import NextTopLoader from 'nextjs-toploader';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobi - Create Profile',
  description: 'Jobi - Job Porta - Find your dream job today!'
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role === 'employee') {
    return redirect('/');
  }
  return (
    <>
      <NextTopLoader showSpinner={false} />
      <CommonBreadcrumb
        title="Choose Profile"
        subtitle="Create profile according to your preference"
      />
      {children}
    </>
  );
};
export default Layout;

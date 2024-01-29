import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import React from 'react';

export default async function ProtectedAuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) {
    redirect('/');
  }

  return <>{children}</>;
}

'use client';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import EmployAside from '@/app/components/dashboard/employ/aside';
import Wrapper from '@/layouts/wrapper';
import { getUserById } from '@/lib/actions/user.action';
import { useAuth } from '@clerk/nextjs';
import { redirect, usePathname } from 'next/navigation';
// import 'bootstrap/dist/js/bootstrap.bundle.js';
import NextTopLoader from 'nextjs-toploader';

import React, { useEffect, useState } from 'react';

const EmployDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const pathname = usePathname();
  const { userId } = useAuth();
  useEffect(() => {
    async function checkUser() {
      const currentUser = await getUserById({ userId });
      if (currentUser?.role !== 'employee') {
        redirect('/');
      }
    }
    checkUser();
  }, [userId]);

  return (
    <Wrapper>
      <NextTopLoader showSpinner={false} />
      <div className="main-page-wrapper">
        <EmployAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <div className="dashboard-body">
          <div className="position-relative">
            <DashboardHeader
              route={pathname}
              setIsOpenSidebar={setIsOpenSidebar}
            />
            {children}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default EmployDashboardLayout;

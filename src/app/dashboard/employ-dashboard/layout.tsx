'use client';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import EmployAside from '@/app/components/dashboard/employ/aside';
import Wrapper from '@/layouts/wrapper';
import { getUserById } from '@/lib/actions/user.action';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import React, { useEffect, useState } from 'react';

const EmployDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const { userId } = useAuth();
  useEffect(() => {
    async function checkUser() {
      const currentUser = await getUserById({ userId });
      console.log('checkUser employee dashboard  currentUser:', currentUser);
      if (currentUser?.role !== 'employee') {
        redirect('/');
      }
    }
    checkUser();
  }, [userId]);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <EmployAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        <div className="dashboard-body">
          <div className="position-relative">
            <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
            {children}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default EmployDashboardLayout;

'use client';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import EmployAside from '@/app/components/dashboard/employ/aside';
import Wrapper from '@/layouts/wrapper';
import React, { useState } from 'react';

const EmployDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
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

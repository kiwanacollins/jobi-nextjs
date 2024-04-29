'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import DashboardHeader from '../candidate/dashboard-header';
import EmployAside from './aside';

const EmployeDashboardLayoutContent = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const pathname = usePathname();
  return (
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
  );
};
export default EmployeDashboardLayoutContent;

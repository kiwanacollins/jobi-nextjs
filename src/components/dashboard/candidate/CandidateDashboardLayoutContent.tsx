'use client';
import React, { useState } from 'react';
import CandidateAside from './aside';
import DashboardHeader from './dashboard-header';
import { usePathname } from 'next/navigation';

const CandidateDashboardLayoutContent = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const pathname = usePathname();
  return (
    <div className="main-page-wrapper">
      <CandidateAside
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
export default CandidateDashboardLayoutContent;

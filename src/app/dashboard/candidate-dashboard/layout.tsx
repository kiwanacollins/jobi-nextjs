'use client';
import CandidateAside from '@/app/components/dashboard/candidate/aside';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import Wrapper from '@/layouts/wrapper';
import React, { useState } from 'react';

const CandidateDashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <CandidateAside
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
export default CandidateDashboardLayout;

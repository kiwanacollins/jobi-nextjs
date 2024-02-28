'use client';
import AdminAside from '@/app/components/dashboard/admin/AdminAside';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import Wrapper from '@/layouts/wrapper';
import React, { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const CandidateDashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        <AdminAside
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

'use client';

import React, { useState } from 'react';
import DashboardHeader from '../candidate/dashboard-header';
import AdminAside from './AdminAside';
import { usePathname } from 'next/navigation';

const AdminDashboardLayoutContent = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const pathname = usePathname();
  return (
    <div className="main-page-wrapper">
      <AdminAside
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
export default AdminDashboardLayoutContent;

'use client';
import AdminAside from '@/app/components/dashboard/admin/AdminAside';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import Wrapper from '@/layouts/wrapper';
import { getUserById } from '@/lib/actions/user.action';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/js/bootstrap';

const CandidateDashboardLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

  const { userId } = useAuth();
  useEffect(() => {
    async function checkUser() {
      const currentUser = await getUserById({ userId });
      if (!currentUser?.isAdmin) {
        redirect('/');
      }
    }
    checkUser();
  }, [userId]);
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

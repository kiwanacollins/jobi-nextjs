'use client';
import CandidateAside from '@/app/components/dashboard/candidate/aside';
import DashboardHeader from '@/app/components/dashboard/candidate/dashboard-header';
import Wrapper from '@/layouts/wrapper';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useAuth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';

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
      if (currentUser?.role !== 'candidate') {
        redirect('/');
      }
    }
    checkUser();
  }, [userId]);
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

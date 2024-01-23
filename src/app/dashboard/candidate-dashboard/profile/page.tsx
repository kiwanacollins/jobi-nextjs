'use client';
import React, { useEffect, useState } from 'react';
import Wrapper from '@/layouts/wrapper';
import CandidateAside from '@/app/components/dashboard/candidate/aside';
import DashboardProfileArea from '@/app/components/dashboard/candidate/dashboard-profile-area';
import { redirect } from 'next/navigation';
import { IUser } from '@/database/user.model';
import { useAuth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';

const CandidateProfilePage = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const { userId } = useAuth();
  const [mongoUser, setMongoUser] = useState<IUser | null>(null);
  if (!userId) redirect('/sign-in');
  useEffect(() => {
    getUserById({ userId })
      .then((user) => {
        setMongoUser(user);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [userId]);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* aside start */}
        <CandidateAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        {/* aside end  */}

        {/* profile area start */}
        <DashboardProfileArea
          mongoUser={mongoUser}
          userId={userId}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        {/* profile area end */}
      </div>
    </Wrapper>
  );
};

export default CandidateProfilePage;

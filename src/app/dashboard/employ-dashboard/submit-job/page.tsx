'use client';
import React, { useEffect, useState } from 'react';
import Wrapper from '@/layouts/wrapper';
import EmployAside from '@/app/components/dashboard/employ/aside';
import SubmitJobArea from '@/app/components/dashboard/employ/submit-job-area';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';

const EmployDashboardSubmitJobPage = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const { userId } = useAuth();
  const [mongoUserId, setMongoUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) redirect('/sign-in');

    getUserById({ userId })
      .then((user) => {
        setMongoUser(user._id);
      })
      .catch((error) => {
        setError(error);
      });
  }, [userId]);

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* aside start */}
        <EmployAside
          isOpenSidebar={isOpenSidebar}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        {/* aside end  */}

        {/* submit job area start */}
        <SubmitJobArea
          mongoUserId={JSON.stringify(mongoUserId)}
          setIsOpenSidebar={setIsOpenSidebar}
        />
        {/* submit job area end */}
      </div>
    </Wrapper>
  );
};

export default EmployDashboardSubmitJobPage;

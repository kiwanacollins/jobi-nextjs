import React from 'react';

import UpdateJobArea from '@/components/dashboard/employ/update-job-area';
import { getJobById } from '@/lib/actions/job.action';
import { IJobData } from '@/database/job.model';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.action';
interface ParamsProps {
  params: { id: string };
}

const EmployDashboardSubmitJobPage = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });
  if (currentUser?.role !== 'employee') {
    redirect('/');
  }
  const { job } = await getJobById(params.id as string);

  return (
    <>
      {/* submit job area start */}
      <UpdateJobArea job={job as IJobData} />
      {/* submit job area end */}
    </>
  );
};

export default EmployDashboardSubmitJobPage;

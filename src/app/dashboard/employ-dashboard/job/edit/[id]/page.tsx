import React from 'react';

import UpdateJobArea from '@/app/components/dashboard/employ/update-job-area';
import { getJobById } from '@/lib/actions/job.action';
import { IJobData } from '@/database/job.model';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
interface ParamsProps {
  params: { id: string };
}

const EmployDashboardSubmitJobPage = async ({ params }: ParamsProps) => {
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== 'employee') {
    return redirect('/');
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

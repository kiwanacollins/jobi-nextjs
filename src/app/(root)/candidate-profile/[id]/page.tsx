import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import CandidateProfileBreadcrumb from '@/components/candidate-details/profile-bredcrumb';
import CandidateDetailsArea from '@/components/candidate-details/candidate-details-area';
import { getResumeById } from '@/lib/actions/candidate.action';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Candidate Details'
};

export interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}

const CandidateProfileDetailsPage = async ({ params }: URLProps) => {
  const candidateDetials = await getResumeById(params.id);
  
  // If no candidate found, return 404
  if (!candidateDetials) {
    notFound();
  }
  
  const { userId } = auth();
  const loggInUser = await getUserById({ userId });

  return (
    <>
      {/* breadcrumb start */}
      <CandidateProfileBreadcrumb
        title="Candidate Profile"
        subtitle="Candidate Profile"
      />
      {/* breadcrumb end */}

      {/* candidate details area start */}
      <CandidateDetailsArea
        candidateDetials={JSON.parse(JSON.stringify(candidateDetials))}
      />
      {/* candidate details area end */}

      {/* job portal intro start */}
      <JobPortalIntro loggInUser={loggInUser} top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default CandidateProfileDetailsPage;

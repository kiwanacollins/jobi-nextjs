import React from 'react';
import { Metadata } from 'next';
import JobBreadcrumb from '../../components/jobs/breadcrumb/job-breadcrumb';
import JobPortalIntro from '../../components/job-portal-intro/job-portal-intro';
import CandidateV1Area from '../../components/candidate/candidate-v1-area';

import { getAllCandidates } from '@/lib/actions/candidate.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';

export const metadata: Metadata = {
  title: 'Candidates',
  description:
    'Connect with skilled professionals and discover the perfect candidates for your team. HireSkills is your go-to platform for finding exceptional talent in various industries.'
};

const CandidateV2Page = async ({ searchParams }: SearchParamsProps) => {
  const { candidates, isNext } = await getAllCandidates({
    keyword: searchParams?.keyword,
    query: searchParams?.query,
    skill: searchParams?.skill,
    qualification: searchParams?.qualification,
    gender: searchParams?.gender,
    location: searchParams?.location,
    experience: searchParams?.experience,
    fluency: searchParams?.fluency,
    duration: searchParams?.duration,
    category: searchParams?.category,
    page: searchParams.page ? +searchParams.page : 1,
    sort: searchParams.sort
    // min: searchParams.min,
    // max: searchParams.max
  });

  const { userId } = auth();
  const loggedInUser = await getUserById({ userId });

  return (
    <div>
      {/* search breadcrumb start */}
      <JobBreadcrumb
        title="Candidates"
        subtitle="Find you desire talents & make your work done"
      />
      {/* search breadcrumb end */}

      {/* candidate area start */}
      <CandidateV1Area
        candidates={JSON.parse(JSON.stringify(candidates))}
        loggedInUser={loggedInUser}
        style_2={true}
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={isNext}
      />
      {/* candidate area end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </div>
  );
};

export default CandidateV2Page;

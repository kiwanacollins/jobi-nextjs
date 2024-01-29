import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '../../components/job-portal-intro/job-portal-intro';
import CandidateProfileBreadcrumb from '../../components/candidate-details/profile-bredcrumb';
import CandidateDetailsArea from '../../components/candidate-details/candidate-details-area';

export const metadata: Metadata = {
  title: 'Candidate Details v1'
};

const CandidateProfileDetailsPage = () => {
  return (
    <>
      {/* breadcrumb start */}
      <CandidateProfileBreadcrumb
        title="Candidate Profile"
        subtitle="Candidate Profile"
      />
      {/* breadcrumb end */}

      {/* candidate details area start */}
      <CandidateDetailsArea />
      {/* candidate details area end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default CandidateProfileDetailsPage;

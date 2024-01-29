import React from 'react';
import { Metadata } from 'next';
import JobBreadcrumb from '../../components/jobs/breadcrumb/job-breadcrumb';
import JobListThree from '../../components/jobs/list/job-list-three';
import JobPortalIntro from '../../components/job-portal-intro/job-portal-intro';

export const metadata: Metadata = {
  title: 'Jobs - Hireskills',
  description:
    'Explore a wide range of job opportunities on HireSkills. From tech to marketing, find your dream job and take the next step in your career. Your future starts here.'
};

const JobListOnePage = () => {
  return (
    <>
      {/* search breadcrumb start */}
      <JobBreadcrumb />
      {/* search breadcrumb end */}

      {/* job list three start */}
      <JobListThree itemsPerPage={8} />
      {/* job list three end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default JobListOnePage;

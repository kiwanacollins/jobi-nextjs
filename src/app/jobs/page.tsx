import React from 'react';
import { Metadata } from 'next';
import Header from '@/layouts/headers/header';
import Wrapper from '@/layouts/wrapper';
import JobBreadcrumb from '../components/jobs/breadcrumb/job-breadcrumb';
import JobListThree from '../components/jobs/list/job-list-three';
import JobPortalIntro from '../components/job-portal-intro/job-portal-intro';
import FooterOne from '@/layouts/footers/footer-one';

export const metadata: Metadata = {
  title: 'Jobs - Hireskills',
  description:
    'Explore a wide range of job opportunities on HireSkills. From tech to marketing, find your dream job and take the next step in your career. Your future starts here.'
};

const JobListOnePage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}

        {/* search breadcrumb start */}
        <JobBreadcrumb />
        {/* search breadcrumb end */}

        {/* job list three start */}
        <JobListThree itemsPerPage={8} />
        {/* job list three end */}

        {/* job portal intro start */}
        <JobPortalIntro top_border={true} />
        {/* job portal intro end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default JobListOnePage;

import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import CompanyBreadcrumb from '@/components/common/common-breadcrumb';
import FaqArea from '@/components/faqs/faq-area';

export const metadata: Metadata = {
  title: 'Faq'
};

const FaqPage = () => {
  return (
    <>
      {/*breadcrumb start */}
      <CompanyBreadcrumb
        title="Question & Answers"
        subtitle="Find your answers"
      />
      {/*breadcrumb end */}

      {/* faq area start */}
      <FaqArea />
      {/* faq area end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default FaqPage;

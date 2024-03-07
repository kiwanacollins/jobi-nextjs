import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '../../components/job-portal-intro/job-portal-intro';
import CompanyBreadcrumb from '../../components/common/common-breadcrumb';
import BlogFullWidthArea from '../../components/blogs/blog-frull-width';
import { fetchAllBlogs } from '@/lib/actions/blog.action';

export const metadata: Metadata = {
  title: 'Blog - Hireskills',
  description:
    'Stay informed and inspired with the latest insights, trends, and career advice on the HireSkills blog. Discover valuable resources to enhance your hiring process and career development.'
};

const BlogV3Page = async () => {
  const blogs = await fetchAllBlogs();
  return (
    <>
      {/*breadcrumb start */}
      <CompanyBreadcrumb
        title="Blog"
        subtitle="Read our blog from top talents"
      />
      {/*breadcrumb end */}
      {/* blog v3 start */}
      <BlogFullWidthArea blogs={blogs} />
      {/* blog v3 end */}

      {/* job portal intro start */}
      <JobPortalIntro top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default BlogV3Page;

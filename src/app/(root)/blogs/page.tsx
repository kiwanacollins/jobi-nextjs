import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import CompanyBreadcrumb from '@/components/common/common-breadcrumb';
import BlogFullWidthArea from '@/components/blogs/blog-frull-width';
import { fetchAllBlogs } from '@/lib/actions/blog.action';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';

export const metadata: Metadata = {
  title: 'Blog - Ugandan Jobs',
  description:
    'Stay informed and inspired with the latest insights, trends, and career advice on the Ugandan Jobs blog. Discover valuable resources to enhance your hiring process and career development.'
};

const BlogV3Page = async () => {
  const blogs = await fetchAllBlogs();
  const { userId } = auth();
  const loggInUser = await getUserById({ userId });

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
      <JobPortalIntro loggInUser={loggInUser} top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default BlogV3Page;

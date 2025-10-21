import React from 'react';
import { Metadata } from 'next';
import JobBreadcrumb from '@/components/jobs/breadcrumb/job-breadcrumb';
import JobListThree from '@/components/jobs/list/job-list-three';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import { getJobPosts } from '@/lib/actions/job.action';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { siteMetadata, buildUrl } from '@/lib/seo';

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Browse Jobs in Uganda & Remote Roles for Ugandan Candidates',
  description:
    'Filter verified vacancies across Kampala, Entebbe, Mbarara and remote teams abroad. Discover full-time, part-time and contract roles for Ugandan professionals.',
  alternates: {
    canonical: '/jobs'
  },
  openGraph: {
    title: 'Latest Jobs in Uganda | Ugandan Jobs Portal',
    description:
      'Search the newest listings from local employers and international companies seeking Ugandan talent.',
    url: buildUrl('/jobs'),
    type: 'website',
    images: [
      {
        url: buildUrl('/logo.png'),
        width: 1200,
        height: 630,
        alt: `${siteMetadata.siteName} job listings`
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ugandan Jobs – Fresh Listings Updated Daily',
    description:
      'Find trusted openings for Ugandan job seekers including remote and international opportunities.'
  }
};

const JobListOnePage = async ({ searchParams }: SearchParamsProps) => {
  const { jobs } = await getJobPosts({
    category: searchParams.category,
    query: searchParams.query
  });
  const { userId } = auth();
  const loggInUser = await getUserById({ userId });
  return (
    <>
      {/* search breadcrumb start */}
      <JobBreadcrumb />
      {/* search breadcrumb end */}

      {/* job list three start */}
      <JobListThree
        allJobs={jobs}
        currentUser={JSON.parse(JSON.stringify(loggInUser))}
        itemsPerPage={8}
      />
      {/* job list three end */}

      {/* job portal intro start */}
      <JobPortalIntro loggInUser={loggInUser} top_border={true} />
      {/* job portal intro end */}
    </>
  );
};

export default JobListOnePage;

import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import JobDetailsV2Area from '@/components/job-details/job-details-v2-area';
import { getJobById } from '@/lib/actions/job.action';
import JobDetailsBreadcrumbTwo from '@/components/jobs/breadcrumb/job-details-breadcrumb-2';
import { notFound } from 'next/navigation';
import { buildJobPostingJsonLd, buildJobShareMetadata, siteMetadata, buildUrl } from '@/lib/seo';

// Dynamic metadata to ensure correct Open Graph/Twitter for WhatsApp
export async function generateMetadata({ params }: URLProps): Promise<Metadata> {
  const result = await getJobById(params.id);

  if (result.status === 'error' || !result.job) {
    return { title: 'Job Not Found - Ugandan Jobs' };
  }

  const job = result.job;
  const share = buildJobShareMetadata(job);
  const jobUrl = buildUrl(`/job/${params.id}`);

  return {
    title: `${job.title} at ${job.company} | Jobs in Uganda` ,
    description: share?.description,
    alternates: { canonical: job.slug ? buildUrl(`/jobs/${job.slug}`) : jobUrl },
    openGraph: {
      title: share?.title || job.title,
      description: share?.description,
      url: job.slug ? buildUrl(`/jobs/${job.slug}`) : jobUrl,
      siteName: siteMetadata.siteName,
      type: 'article',
      locale: siteMetadata.locale,
      images: share?.imageUrl
        ? [{ url: share.imageUrl, width: 1200, height: 630, alt: share.alt, type: 'image/png' }]
        : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: share?.title || job.title,
      description: share?.description,
      images: share?.imageUrl ? [share.imageUrl] : undefined,
      creator: siteMetadata.twitterHandle
    }
  };
}

interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}

const JobDetailsV1Page = async ({ params }: URLProps) => {
  const result = await getJobById(params?.id);
  
  // Handle case where job is not found
  if (result.status === 'error' || !result.job) {
    notFound();
  }
  
  const { job } = result;
  const structuredData = buildJobPostingJsonLd(job);
  
  return (
    <>
      {/* job details breadcrumb start */}
      <JobDetailsBreadcrumbTwo
        title={job?.title || 'Job Details'}
        company={job?.createdBy?.name as string || 'Company'}
        createdAt={job?.createAt as Date}
        website={job?.createdBy?.website as URL}
        createdBy={job?.createdBy?._id}
      />
      {/* job details breadcrumb end */}

      {/* Structured data for Google Jobs */}
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      ) : null}

      {/* job details area start */}
      <JobDetailsV2Area job={job} />
      {/* job details area end */}

      {/* job portal intro start */}
      <JobPortalIntro />
      {/* job portal intro end */}
    </>
  );
};

export default JobDetailsV1Page;

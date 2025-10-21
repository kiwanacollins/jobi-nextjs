import React from 'react';
import { Metadata } from 'next';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import JobDetailsV2Area from '@/components/job-details/job-details-v2-area';
import { getJobBySlug, getRelatedJobs } from '@/lib/actions/job.action';
import JobDetailsBreadcrumbTwo from '@/components/jobs/breadcrumb/job-details-breadcrumb-2';
import { notFound } from 'next/navigation';
import { buildUrl, buildJobPostingJsonLd, siteMetadata } from '@/lib/seo';

interface URLProps {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: URLProps): Promise<Metadata> {
  const result = await getJobBySlug(params.slug);
  
  if (result.status === 'error' || !result.job) {
    return {
      title: 'Job Not Found - Ugandan Jobs'
    };
  }
  
  const job = result.job;
  const title = `${job.title} at ${job.company} | Jobs in Uganda`;
  const overview = typeof job.overview === 'string' ? job.overview : '';
  const plainDescription = overview
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const locationText = job.location ? `Based in ${job.location}. ` : '';
  const summary = `${locationText}${plainDescription || `${job.duration} role in ${job.category}.`}`.slice(0, 180);
  const description = summary.endsWith('.') ? summary : `${summary}...`;
  const jobUrl = buildUrl(`/jobs/${params.slug}`);
  const rawImage =
    job.companyImage ||
    (typeof job.createdBy?.picture === 'string' ? job.createdBy.picture : undefined);
  const imageUrl = rawImage
    ? rawImage.startsWith('http')
      ? rawImage
      : rawImage.startsWith('data:')
        ? buildUrl('/logo.png')
        : buildUrl(rawImage)
    : buildUrl('/logo.png');
  const imageAlt = job.company
    ? `${job.company} company logo`
    : `${siteMetadata.siteName} job listing`;
  
  return {
    title,
    description,
    alternates: {
      canonical: jobUrl
    },
    keywords: [
      job.title,
      job.company,
      job.category,
      'Uganda jobs',
      job.location || 'Uganda'
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      url: jobUrl,
      siteName: siteMetadata.siteName,
      type: 'article',
      locale: siteMetadata.locale,
      images: [
        {
          url: imageUrl,
          ...(imageUrl.startsWith('https://') ? { secureUrl: imageUrl } : {}),
          width: 1200,
          height: 630,
          alt: imageAlt
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  };
}

const JobDetailsPage = async ({ params }: URLProps) => {
  const result = await getJobBySlug(params.slug);
  
  // Handle case where job is not found
  if (result.status === 'error' || !result.job) {
    notFound();
  }
  
  const { job } = result;
  const structuredData = buildJobPostingJsonLd(job);
  
  // Fetch related jobs
  const relatedJobsResult = await getRelatedJobs({
    currentJobId: job._id,
    category: job.category,
    limit: 10
  });
  
  const relatedJobs = relatedJobsResult.status === 'ok' ? relatedJobsResult.jobs : [];
  
  return (
    <>
      {structuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      ) : null}
      {/* job details breadcrumb start */}
      <JobDetailsBreadcrumbTwo
        title={job?.title || 'Job Details'}
        company={job?.createdBy?.name as string || 'Company'}
        createdAt={job?.createAt as Date}
        website={job?.createdBy?.website as URL}
        createdBy={job?.createdBy?._id}
      />
      {/* job details breadcrumb end */}

      {/* job details area start */}
      <JobDetailsV2Area job={job} relatedJobs={relatedJobs} />
      {/* job details area end */}

      {/* job portal intro start */}
      <JobPortalIntro />
      {/* job portal intro end */}
    </>
  );
};

export default JobDetailsPage;
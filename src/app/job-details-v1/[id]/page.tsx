import React from 'react';
import Wrapper from '@/layouts/wrapper';
import Header from '@/layouts/headers/header';
import JobDetailsV1Area from '@/components/job-details/job-details-v1-area';
import JobPortalIntro from '@/components/job-portal-intro/job-portal-intro';
import JobDetailsBreadcrumb from '@/components/jobs/breadcrumb/job-details-breadcrumb';
import FooterOne from '@/layouts/footers/footer-one';
import job_data from '@/data/job-data';
import { getJobById, getRelatedJobs } from '@/lib/actions/job.action';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `Job Details - ${params.id}`
  };
}

const JobDetailsDynamicPage = async ({ params }: { params: { id: string } }) => {
  // First try to find in static data
  let job = job_data.find((j) => Number(j.id) === Number(params.id));
  let relatedJobs: any[] = [];
  
  // If not found in static data, try to fetch from database
  if (!job) {
    try {
      const result = await getJobById(params.id);
      if (result.status === 'ok' && result.job) {
        // Convert database job to expected format
        job = {
          id: result.job._id,
          _id: result.job._id,
          logo: job_data[0].logo, // Use a default logo for database jobs
          title: result.job.title,
          duration: result.job.duration,
          date: result.job.createAt ? new Date(result.job.createAt).toLocaleDateString() : 'Recent',
          company: result.job.createdBy?.name || 'Company',
          location: result.job.location || 'Remote',
          category: [result.job.category],
          tags: result.job.skills || [],
          experience: result.job.experience || 'Not specified',
          salary: result.job.maxSalary || 0,
          salary_duration: result.job.salary_duration || 'month',
          english_fluency: result.job.english_fluency || 'Not specified',
          overview: result.job.overview,
          minSalary: result.job.minSalary?.toString(),
          maxSalary: result.job.maxSalary?.toString(),
        };
        
        // Fetch related jobs for database jobs
        const relatedResult = await getRelatedJobs({
          currentJobId: result.job._id,
          category: result.job.category,
          limit: 10
        });
        
        if (relatedResult.status === 'ok') {
          relatedJobs = relatedResult.jobs;
        }
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  }

  // If still no job found, return 404
  if (!job) {
    notFound();
  }

  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <Header />
        {/* header end */}

        {/* job details breadcrumb start */}
        <JobDetailsBreadcrumb />
        {/* job details breadcrumb end */}

        {/* job details area start */}
        <JobDetailsV1Area job={job} relatedJobs={relatedJobs} />
        {/* job details area end */}

        {/* job portal intro start */}
        <JobPortalIntro />
        {/* job portal intro end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default JobDetailsDynamicPage;

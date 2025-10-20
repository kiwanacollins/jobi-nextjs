'use client';
import React from 'react';
import Image from 'next/image';
import icon_1 from '@/assets/images/icon/icon_52.svg';
import icon_2 from '@/assets/images/icon/icon_53.svg';
import icon_3 from '@/assets/images/icon/icon_54.svg';
import icon_4 from '@/assets/images/icon/icon_55.svg';
import icon_5 from '@/assets/images/icon/icon_56.svg';
import { IJobData } from '@/database/job.model';
import ParseHTML from '../common/parseHTML';
import { useAuth } from '@clerk/nextjs';
import { applyForJob } from '@/lib/actions/candidate.action';
import Swal from 'sweetalert2';
import RelatedJobs from './RelatedJobs';

interface IJobDetailsV2AreaProps {
  job: IJobData & {
    createdBy?: {
      name?: string;
      picture?: string;
      website?: string;
      isAdmin?: boolean;
      _id?: string;
    };
  };
  relatedJobs?: IJobData[];
}

const JobDetailsV2Area = ({ job, relatedJobs = [] }: IJobDetailsV2AreaProps) => {
  const { userId: loginInUserId } = useAuth();
  
  // Format deadline date
  const formatDeadline = (deadline: string | Date | undefined) => {
    if (!deadline) return 'Not specified';
    const date = new Date(deadline);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });
  };

  // Generate job URL for sharing
  const getJobUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return job?.slug ? `${process.env.NEXT_PUBLIC_SERVER_URL}/jobs/${job.slug}` : '#';
  };

  // Social sharing functions
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getJobUrl());
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(getJobUrl());
    const title = encodeURIComponent(`${job?.title} at ${job?.company}`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
  };

  const shareOnX = () => {
    const url = encodeURIComponent(getJobUrl());
    const text = encodeURIComponent(`Check out this job opportunity: ${job?.title} at ${job?.company}`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    const url = encodeURIComponent(getJobUrl());
    const text = encodeURIComponent(`Check out this job: ${job?.title} at ${job?.company} - ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Job Opportunity: ${job?.title} at ${job?.company}`);
    const body = encodeURIComponent(`Hi,\n\nI thought you might be interested in this job opportunity:\n\n${job?.title} at ${job?.company}\n${job?.location ? `Location: ${job?.location}\n` : ''}${job?.duration ? `Type: ${job?.duration}\n` : ''}\n${getJobUrl()}\n\nBest regards`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleJobApplication = async (
    userId: string | null | undefined,
    jobId: string
  ) => {
    Swal.fire({
      title: 'Are you sure you want to apply for this job?',
      text: 'Your application will be sent to the employer with your profile and resume informations!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Apply for it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        //Todo: delete job post by Id
        const res = await applyForJob({
          clerkId: userId,
          jobId
        });
        if (res.status === 'ok') {
          Swal.fire({
            title: 'Confirmed!',
            text: res.message,
            icon: 'success'
          });
        }
        if (res.status === 'error') {
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error'
          });
        }
      }
    });
  };

  return (
    <section className="job-details style-two pt-100 lg-pt-80 pb-130 lg-pb-80">
      <div className="container">
        {/* New Job Header Section */}
        <div className="job-header-card bg-white border rounded-3 p-4 mb-5" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-start gap-3 gap-md-4 flex-wrap">
                {/* Company Logo */}
                <div className="company-logo-wrapper flex-shrink-0">
                  {job?.companyImage ? (
                    <Image
                      src={job.companyImage}
                      alt={`${job.company || 'Company'} logo`}
                      width={80}
                      height={80}
                      className="rounded-circle border"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '80px', height: '80px', fontSize: '24px', fontWeight: '600' }}>
                      {(job?.company || 'C')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Job Info */}
                <div className="job-info flex-grow-1" style={{minWidth:'0'}}>
                  <h1 className="job-title h4 h3-md text-dark mb-2 fw-bold text-truncate">{job?.title}</h1>
                  <p className="company-name h6 text-secondary mb-3 fw-normal">{job?.company}</p>
                  
                  {/* Job Meta Info */}
                  <div className="job-meta d-flex flex-wrap align-items-center gap-2 gap-md-3 mb-0">
                    {/* Job Type Badge */}
                    <span className="badge text-primary border border-primary px-3 py-2 rounded-pill fw-normal" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                      <i className="bi bi-briefcase me-1"></i>
                      {job?.duration}
                    </span>
                    
                    {/* Category Badge */}
                    {job?.category && (
                      <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">
                        {job.category}
                      </span>
                    )}
                    
                    {/* Deadline */}
                    {job?.deadline && (
                      <span className="text-muted d-flex align-items-center fw-normal">
                        <i className="bi bi-calendar-event me-2"></i>
                        <strong>Deadline:</strong>&nbsp;{formatDeadline(job.deadline)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Apply Now Button */}
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              {!job?.createdBy?.isAdmin && (
                <button
                  onClick={() => handleJobApplication(loginInUserId, job?._id)}
                  className="btn text-white fw-semibold px-4 py-3 rounded-3"
                  style={{ backgroundColor: '#6c5ce7', border: 'none' }}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xxl-9 col-xl-10 m-auto">
            <div className="details-post-data ps-xxl-4 pe-xxl-4">
              <div className="post-block mt-60 lg-mt-40">
                <h4 className="block-title">Job Description</h4>
                <ParseHTML data={job?.overview} />
              </div>

              {/* Social Sharing Card */}
              <div className="post-block border-style mt-50 lg-mt-30">
                <div className="share-post-wrapper bg-white rounded-3 p-4">
                  <h5 className="fw-600 mb-3">Share this post:</h5>
                  <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                    {/* Copy Link */}
                    <button
                      onClick={copyToClipboard}
                      className="share-btn d-flex align-items-center gap-2 px-3 py-2 bg-light border rounded-pill text-decoration-none text-dark fw-500"
                      style={{ transition: 'all 0.3s ease' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    >
                      <i className="bi bi-link-45deg"></i>
                      <span>Copy Link</span>
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={shareOnFacebook}
                      className="share-btn d-flex align-items-center gap-2 px-3 py-2 border rounded-pill text-decoration-none fw-500"
                      style={{ 
                        backgroundColor: '#1877f2', 
                        color: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#166fe5'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1877f2'}
                    >
                      <i className="bi bi-facebook"></i>
                      <span>Facebook</span>
                    </button>

                    {/* X (Twitter) */}
                    <button
                      onClick={shareOnX}
                      className="share-btn d-flex align-items-center justify-content-center gap-2 px-3 py-2 border rounded-pill text-decoration-none fw-500"
                      style={{ 
                        backgroundColor: '#000000', 
                        color: 'white',
                        transition: 'all 0.3s ease',
                        lineHeight: '1.5'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333333'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                    >
                      <i className="bi bi-twitter-x" style={{lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center'}}></i>
                      <span>X</span>
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={shareOnWhatsApp}
                      className="share-btn d-flex align-items-center gap-2 px-3 py-2 border rounded-pill text-decoration-none fw-500"
                      style={{ 
                        backgroundColor: '#25d366', 
                        color: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#22c55e'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25d366'}
                    >
                      <i className="bi bi-whatsapp"></i>
                      <span>WhatsApp</span>
                    </button>

                    {/* Email */}
                    <button
                      onClick={shareViaEmail}
                      className="share-btn d-flex align-items-center gap-2 px-3 py-2 border rounded-pill text-decoration-none fw-500"
                      style={{ 
                        backgroundColor: '#6c757d', 
                        color: 'white',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5c636a'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                    >
                      <i className="bi bi-envelope"></i>
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="post-block mt-70 lg-mt-40">
                <h4 className="block-title">Responsibilities</h4>
                <ul className="list-type-one style-none mb-15">
                  <li>
                    Collaborate daily with a multidisciplinary team of Software
                    Engineers, Researchers, Strategists, and Project Managers.
                  </li>
                  <li>
                    Co-lead ideation sessions, workshops, demos, and
                    presentations with clients on-site
                  </li>
                  <li>
                    Push for and create inclusive, accessible design for all
                  </li>
                  <li>
                    Maintain quality of the design process and ensure that when
                    designs are translated into code they accurately reflect the
                    design specifications.
                  </li>
                  <li>
                    Sketch, wireframe, build IA, motion design, and run
                    usability tests
                  </li>
                  <li>
                    Design pixel perfect responsive UI’s and understand that
                    adopting common interface pattern is better for UX than
                    reinventing the wheel
                  </li>
                  <li>
                    Ensure content strategy and design are perfectly in-sync
                  </li>
                  <li>
                    Give and receive design critique to help constantly refine
                    and push our work
                  </li>
                </ul>
              </div>
              <div className="post-block mt-55 lg-mt-40">
                <h4 className="block-title">Required Skills:</h4>
                <ul className="list-type-two style-none mb-15">
                  <li>You’ve been designing digital products for 2+ years.</li>
                  <li>
                    A portfolio that exemplifies strong visual design and a
                    focus on defining the user experience.
                  </li>
                  <li>You’ve proudly shipped and launched several products.</li>
                  <li>
                    You have some past experience working in an agile
                    environment – Think two-week sprints.
                  </li>
                  <li>
                    Experience effectively presenting and communicating your
                    design decisions to clients and team members
                  </li>
                  <li>
                    Up-to-date knowledge of design software like Figma, Sketch
                    etc.
                  </li>
                </ul>
              </div>
              <div className="post-block mt-55 lg-mt-40">
                <h4 className="block-title">Benefits:</h4>
                <ul className="list-type-two style-none mb-15">
                  <li>We are a remote-first company.</li>
                  <li>
                    100% company-paid health insurance premiums for you & your
                    dependents
                  </li>
                  <li>Vacation stipend</li>
                  <li>Unlimited paid vacation and paid company holidays</li>
                  <li>Monthly wellness/gym stipend</li>
                </ul>
              </div> */}
              {/* Only show apply button if job is not posted by admin */}
              {!job?.createdBy?.isAdmin && (
                <button
                  onClick={() => handleJobApplication(loginInUserId, job?._id)}
                  className="btn-ten text-decoration-none   fw-500 text-white text-center tran3s mt-30"
                >
                  Apply for this position
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Jobs Section */}
      <RelatedJobs jobs={relatedJobs} />
    </section>
  );
};

export default JobDetailsV2Area;

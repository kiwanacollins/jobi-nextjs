'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import CandidateProfileSlider from './candidate-profile-slider';
import VideoPopup from '../common/video-popup';
import Skills from './skills';
import WorkExperience from './work-experience';
import CandidateBio from './bio';
import EmailSendForm from '../forms/email-send-form';
import { IResumeType } from '@/database/resume.model';
import Link from 'next/link';
import Resume from '@/app/components/resume/Resume';
import ResumeModal from '../resume/ResumeModal';
import dynamic from 'next/dynamic';

interface ICandidateDetailsAreaProps {
  candidateDetials: IResumeType;
}

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

const CandidateDetailsArea = ({
  candidateDetials
}: ICandidateDetailsAreaProps) => {
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const { overview, user, education, experience, skills } = candidateDetials;
  return (
    <>
      <section className="candidates-profile pt-100 lg-pt-70 pb-150 lg-pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xxl-9 col-lg-8">
              <div className="candidates-profile-details me-xxl-5 pe-xxl-4">
                <div className="inner-card border-style mb-65 lg-mb-40">
                  <h3 className="title">Overview</h3>
                  <p>{candidateDetials?.overview}</p>
                </div>
                <h3 className="title">Intro</h3>
                <div className="video-post d-flex align-items-center justify-content-center mt-25 lg-mt-20 mb-75 lg-mb-50">
                  <a
                    onClick={() => setIsVideoOpen(true)}
                    className="fancybox rounded-circle video-icon tran3s text-center cursor-pointer"
                  >
                    <i className="bi bi-play"></i>
                  </a>
                </div>
                <div className="inner-card border-style mb-75 lg-mb-50">
                  <h3 className="title">Education</h3>
                  {candidateDetials?.education?.length > 0 &&
                    candidateDetials?.education?.map((item, index) => {
                      return (
                        <div
                          key={item.title + index}
                          className="time-line-data position-relative pt-15"
                        >
                          <div className="info position-relative">
                            <div className="numb fw-500 rounded-circle d-flex align-items-center justify-content-center">
                              1
                            </div>
                            <div className="text_1 fw-500">{item.academy}</div>
                            <h4>{item.title}</h4>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="inner-card border-style mb-75 lg-mb-50">
                  <h3 className="title">Skills</h3>
                  {/* skill area */}

                  <Skills skills={candidateDetials?.skills} />

                  {/* skill area */}
                </div>
                <div className="inner-card border-style mb-60 lg-mb-50">
                  <h3 className="title">Work Experience</h3>
                  {/* WorkExperience */}
                  {candidateDetials.experience?.length > 0 &&
                    candidateDetials.experience?.map((item, index) => (
                      <WorkExperience
                        key={item.title + index}
                        experience={item}
                      />
                    ))}

                  {/* WorkExperience */}
                </div>
                <h3 className="title">Portfolio</h3>
                {/* Candidate Profile Slider */}
                <CandidateProfileSlider />
                {/* Candidate Profile Slider */}
              </div>
            </div>
            <div className="col-xxl-3 col-lg-4">
              <div className="cadidate-profile-sidebar ms-xl-5 ms-xxl-0 md-mt-60">
                <div className="cadidate-bio bg-wrapper bg-color mb-60 md-mb-40">
                  <div className="pt-25">
                    <div className="cadidate-avatar m-auto">
                      <Image
                        //@ts-ignore
                        src={candidateDetials?.user?.picture as string}
                        alt="avatar"
                        width={80}
                        height={80}
                        className="lazy-img rounded-circle w-100"
                      />
                    </div>
                  </div>

                  <h3 className="cadidate-name text-center">
                    {typeof candidateDetials?.user === 'object'
                      ? //@ts-ignore
                        candidateDetials?.user?.name
                      : ''}
                  </h3>
                  <div className="text-center pb-25">
                    <a href="#" className="invite-btn fw-500">
                      Invite
                    </a>
                  </div>
                  {/* CandidateBio */}
                  <CandidateBio />
                  {/* CandidateBio */}
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#resumeModal"
                    rel="noopener noreferrer"
                    className="btn-ten fw-500 text-white w-100 text-center tran3s mt-15"
                  >
                    View Resume
                  </button>
                  <Link
                    href={`${candidateDetials?.pdf?.url}` as string}
                    download={candidateDetials?.pdf?.filename as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ten fw-500 text-white w-100 text-center tran3s mt-15"
                  >
                    <PDFDownloadLink
                      document={
                        <Resume
                          overview={overview}
                          user={user}
                          education={education}
                          experience={experience}
                          skills={skills}
                        />
                      }
                      // @ts-ignore
                      fileName={`${user?.name as string}.pdf`}
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? 'Loading...' : 'Download Resume'
                      }
                    </PDFDownloadLink>
                  </Link>
                </div>
                <h4 className="sidebar-title">Location</h4>
                <div className="map-area mb-60 md-mb-40">
                  <div className="gmap_canvas h-100 w-100">
                    <iframe
                      className="gmap_iframe h-100 w-100"
                      src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=bass hill plaza medical centre&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    ></iframe>
                  </div>
                </div>
                <h4 className="sidebar-title">Email James Brower.</h4>
                <div className="email-form bg-wrapper bg-color">
                  <p>
                    Your email address & profile will be shown to the recipient.
                  </p>
                  <EmailSendForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* video modal start */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={'-6ZbrfSRWKc'}
      />
      {/* video modal end */}
      {/* Resume Modal start */}
      <ResumeModal>
        <Resume
          overview={overview}
          user={user}
          education={education}
          experience={experience}
          skills={skills}
        />
      </ResumeModal>
      {/* Resume Modal end */}
    </>
  );
};

export default CandidateDetailsArea;

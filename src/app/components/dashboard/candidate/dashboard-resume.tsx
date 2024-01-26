'use client';
import React, { useState } from 'react';
import video_bg from '@/assets/dashboard/images/video_post.jpg';
import DashboardPortfolio from './dashboard-portfolio';
import SelectYear from './select-year';
import VideoPopup from '../../common/video-popup';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { resumeSchema } from '@/utils/validation';

const DashboardResume = () => {
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [educationItems, setEducationItems] = useState([{}]);

  const handleAddMore = () => {
    setEducationItems([...educationItems, {}]); // Add a new empty item
  };

  // 1. Define your form.
  const methods = useForm<z.infer<typeof resumeSchema>>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {}
  });

  // react hook form
  const {
    register,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
    reset
  } = methods;

  // 2. Handle your form submission.
  const onSubmit = (data: z.infer<typeof resumeSchema>) => {
    console.log(data);
    reset();
  };

  return (
    <>
      <div className="position-relative">
        <h2 className="main-title">My Resume</h2>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white card-box border-20">
              <h4 className="dash-title-three">Resume Attachment</h4>
              <div className="dash-input-wrapper mb-20">
                <label htmlFor="">CV Attachment*</label>
                <div className="attached-file d-flex align-items-center justify-content-between mb-15">
                  <span>MyCvResume.PDF</span>
                  <a href="#" className="remove-btn">
                    <i className="bi bi-x"></i>
                  </a>
                </div>
                <div className="attached-file d-flex align-items-center justify-content-between">
                  <span>CandidateCV02.PDF</span>
                  <a href="#" className="remove-btn">
                    <i className="bi bi-x"></i>
                  </a>
                </div>
              </div>

              <div className="dash-btn-one d-inline-block position-relative me-3">
                <i className="bi bi-plus"></i>
                Upload CV
                <input
                  type="file"
                  id="uploadCV"
                  name="uploadCV"
                  placeholder=""
                />
              </div>
              <small>Upload file .pdf, .doc, .docx</small>
            </div>

            <div className="bg-white card-box border-20 mt-40">
              <h4 className="dash-title-three">Intro & Overview</h4>
              <div className="dash-input-wrapper mb-35 md-mb-20">
                <label htmlFor="">Overview*</label>
                <textarea
                  className="size-lg"
                  placeholder="Write something interesting about you...."
                  {...register('overview', { required: true })}
                  name="overview"
                ></textarea>
                <div className="alert-text">
                  Brief description for your resume. URLs are hyperlinked.
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6 d-flex">
                  <div
                    className="intro-video-post position-relative mt-20"
                    style={{ backgroundImage: `url(${video_bg.src})` }}
                  >
                    <a
                      className="fancybox rounded-circle video-icon tran3s text-center"
                      onClick={() => setIsVideoOpen(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="bi bi-play"></i>
                    </a>
                    <a href="#" className="close">
                      <i className="bi bi-x"></i>
                    </a>
                  </div>
                </div>
                <div className="col-sm-6 d-flex">
                  <div className="intro-video-post position-relative empty mt-20">
                    <span>+ Add Intro Video</span>
                    <input
                      type="file"
                      id="uploadVdo"
                      placeholder=""
                      {...register('videos')}
                      name="videos"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white card-box border-20 mt-40">
              <h4 className="dash-title-three">Education</h4>

              {/* Add Education Start */}
              {educationItems.map((item, index) => (
                <>
                  <div
                    key={index}
                    className="accordion dash-accordion-one"
                    id={`accordionOne${index}`}
                  >
                    <div className="accordion-item">
                      <div className="accordion-header" id="headingOne">
                        <button
                          className="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseOne${index}`}
                          aria-expanded="false"
                          aria-controls="collapseOne"
                        >
                          Add Education*
                        </button>
                      </div>
                      <div
                        id={`collapseOne${index}`}
                        className="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent={`#accordionOne${index}`}
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="dash-input-wrapper mb-30 md-mb-10">
                                <label htmlFor="">Title*</label>
                              </div>
                            </div>
                            <div className="col-lg-10">
                              <div className="dash-input-wrapper mb-30">
                                <input
                                  type="text"
                                  placeholder="Product Designer (Google)"
                                  {...register('education', {
                                    required: true
                                  })}
                                  name="education.title"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="dash-input-wrapper mb-30 md-mb-10">
                                <label htmlFor="">Academy*</label>
                              </div>
                            </div>
                            <div className="col-lg-10">
                              <div className="dash-input-wrapper mb-30">
                                <input
                                  type="text"
                                  placeholder="Google Arts Collage & University"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="dash-input-wrapper mb-30 md-mb-10">
                                <label htmlFor="">Year*</label>
                              </div>
                            </div>
                            <div className="col-lg-10">
                              <div className="row">
                                <div className="col-sm-6">
                                  <SelectYear />
                                </div>
                                <div className="col-sm-6">
                                  <SelectYear />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="dash-input-wrapper mb-30 md-mb-10">
                                <label htmlFor="">Description*</label>
                              </div>
                            </div>
                            <div className="col-lg-10">
                              <div className="dash-input-wrapper mb-30">
                                <textarea
                                  className="size-lg"
                                  placeholder="Morbi ornare ipsum sed sem condimentum, et pulvinar tortor luctus. Suspendisse condimentum lorem ut elementum aliquam et pulvinar tortor luctus."
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
              {/* Add Education End */}
              <button onClick={() => handleAddMore()} className="dash-btn-one">
                <i className="bi bi-plus"></i> Add more
              </button>
            </div>

            <div className="bg-white card-box border-20 mt-40">
              <h4 className="dash-title-three">Skills & Experience</h4>
              <div className="dash-input-wrapper mb-40">
                <label htmlFor="">Add Skills*</label>

                <div className="skills-wrapper">
                  <ul className="style-none d-flex flex-wrap align-items-center">
                    <li className="is_tag">
                      <button>
                        Figma <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        HTML5 <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        Illustrator <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        Adobe Photoshop <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        WordPress <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        jQuery <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        Web Design <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        Adobe XD <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="is_tag">
                      <button>
                        CSS <i className="bi bi-x"></i>
                      </button>
                    </li>
                    <li className="more_tag">
                      <button>+</button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="dash-input-wrapper mb-15">
                <label htmlFor="">Add Work Experience*</label>
              </div>

              <div className="accordion dash-accordion-one" id="accordionTwo">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingOneA">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOneA"
                      aria-expanded="false"
                      aria-controls="collapseOneA"
                    >
                      Experience 1*
                    </button>
                  </div>
                  <div
                    id="collapseOneA"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOneA"
                    data-bs-parent="#accordionTwo"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="dash-input-wrapper mb-30 md-mb-10">
                            <label htmlFor="">Title*</label>
                          </div>
                        </div>
                        <div className="col-lg-10">
                          <div className="dash-input-wrapper mb-30">
                            <input
                              type="text"
                              placeholder="Lead Product Designer "
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="dash-input-wrapper mb-30 md-mb-10">
                            <label htmlFor="">Company*</label>
                          </div>
                        </div>
                        <div className="col-lg-10">
                          <div className="dash-input-wrapper mb-30">
                            <input type="text" placeholder="Amazon Inc" />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="dash-input-wrapper mb-30 md-mb-10">
                            <label htmlFor="">Year*</label>
                          </div>
                        </div>
                        <div className="col-lg-10">
                          <div className="row">
                            <div className="col-sm-6">
                              <SelectYear />
                            </div>
                            <div className="col-sm-6">
                              <SelectYear />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-2">
                          <div className="dash-input-wrapper mb-30 md-mb-10">
                            <label htmlFor="">Description*</label>
                          </div>
                        </div>
                        <div className="col-lg-10">
                          <div className="dash-input-wrapper mb-30">
                            <textarea
                              className="size-lg"
                              placeholder="Morbi ornare ipsum sed sem condimentum, et pulvinar tortor luctus. Suspendisse condimentum lorem ut elementum aliquam et pulvinar tortor luctus."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a href="#" className="dash-btn-one">
                <i className="bi bi-plus"></i> Add more
              </a>
            </div>

            <DashboardPortfolio />

            <div className="button-group d-inline-flex align-items-center mt-30">
              <a href="#" className="dash-btn-two tran3s me-3">
                Save
              </a>
              <a href="#" className="dash-cancel-btn tran3s">
                Cancel
              </a>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* video modal start */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={'-6ZbrfSRWKc'}
      />
      {/* video modal end */}
    </>
  );
};

export default DashboardResume;

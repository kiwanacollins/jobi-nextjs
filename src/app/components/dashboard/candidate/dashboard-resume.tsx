/* eslint-disable no-undef */
'use client';
import React, { useState } from 'react';
import DashboardPortfolio from './dashboard-portfolio';
import VideoPopup from '../../common/video-popup';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { resumeSchema } from '@/utils/validation';
import ErrorMsg from '../../common/error-msg';
import { createResume, updateResume } from '@/lib/actions/candidate.action';
import { notifyError, notifySuccess } from '@/utils/toast';
import {
  IEducation,
  IExperience,
  IResumeType,
  IVideos,
  Iportfolio
} from '@/database/resume.model';
import { usePathname } from 'next/navigation';
import { IUser } from '@/database/user.model';
import { getLast30YearsOptions } from '@/constants';

interface IProps {
  mongoUser: IUser;
  resume: IResumeType;
}

const DashboardResume = ({ mongoUser, resume }: IProps) => {
  const pathname = usePathname();
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isResumeExist = !!resume?._id;
  const groupedExperience = resume?.experience?.map((item: IExperience) => {
    return {
      title: item.title,
      company: item.company,
      year: item.year,
      description: item.description,
      yearStart: item.yearStart,
      yearEnd: item.yearEnd
    };
  });
  const groupedEducation = resume?.education?.map((item: IEducation) => {
    return {
      title: item.title,
      academy: item.academy,
      year: item.year,
      description: item.description,
      yearStart: item.yearStart,
      yearEnd: item.yearEnd
    };
  });

  const groupedVideos = resume?.videos?.map((item: IVideos) => {
    return {
      title: item.title,
      videoId: item.videoId
    };
  });

  const groupedPortfolio = resume?.portfolio?.map((item: Iportfolio) => {
    return {
      imageUrl: item.imageUrl,
      public_id: item.public_id
    };
  });

  type resumeSchemaType = z.infer<typeof resumeSchema>;

  // 1. Define your form.
  const methods = useForm<resumeSchemaType>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      overview: resume?.overview || mongoUser.bio || '',
      portfolio: groupedPortfolio || [
        {
          imageUrl: ''
        }
      ],
      experience: groupedExperience || [
        {
          title: '',
          company: '',
          year: '',
          description: ''
        }
      ],
      education: groupedEducation || [
        {
          title: '',
          academy: '',
          year: '',
          description: ''
        }
      ],
      videos: groupedVideos || [
        {
          title: '',
          videoId: ''
        }
      ]
    }
  });

  // react hook form
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset
  } = methods;

  const {
    fields: educationArrayFields,
    append: educationAppend,
    remove: educationRemove
  } = useFieldArray({
    control,
    name: 'education'
  });

  const {
    fields: experienceArrayFields,
    append: experienceAppend,
    remove: experienceRemove
  } = useFieldArray({
    control,
    name: 'experience'
  });
  const {
    fields: videosArrayFields,
    append: videoAppend,
    remove: removeVideo
  } = useFieldArray({
    control,
    name: 'videos'
  });

  const simulateProgress = () => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 500); // Adjust the interval and steps based on your preference
  };

  // 2. Handle your form submission.
  const onSubmit = async (data: resumeSchemaType) => {
    setIsSubmitting(true);
    simulateProgress();
    const experience = data?.experience?.map((item: IExperience) => {
      const year = item?.yearStart + '-' + item?.yearEnd;
      return {
        title: item.title,
        company: item.company,
        yearStart: item.yearStart,
        yearEnd: item.yearEnd,
        year,
        description: item.description
      };
    });

    const education = data?.education?.map((item: IEducation) => {
      const year = item.yearStart + '-' + item.yearEnd;
      return {
        title: item.title,
        academy: item.academy,
        yearStart: item.yearStart,
        yearEnd: item.yearEnd,
        year,
        description: item.description
      };
    });

    const videos = data?.videos?.map((item: IVideos) => {
      return {
        title: item.title,
        videoId: item.videoId
      };
    });

    const portfolio = data?.portfolio?.map((item: any) => {
      return item;
    });

    try {
      const resumeData: any = {
        user: mongoUser._id,
        overview: data.overview,
        experience,
        education,
        portfolio,
        videos
      };
      if (isResumeExist) {
        // update resume
        const res = await updateResume({
          resumeId: resume?._id,
          resumeData,
          path: pathname
        });
        if (res.success) {
          setProgress(100);
          notifySuccess(res.message);
        }
        if (res?.error) {
          notifyError(res.message);
          setProgress(0);
        }
      } else {
        const res = await createResume({
          resumeData,
          path: pathname
        });
        if (res?.success) {
          setProgress(100);
          notifySuccess(res.message);
        }
        if (res?.error) {
          notifyError(res.message);
          setProgress(0);
        }
      }
    } catch (error: any) {
      console.log(error);
      setProgress(0);
      notifyError(error as string);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  };

  // useEffect(() => {
  //   reset();
  // }, [reset]);

  const handleAddEducation = (e: any) => {
    e.preventDefault(); // Prevent form submission
    educationAppend({
      title: '',
      academy: '',
      year: '',
      description: '',
      yearStart: 2024
    });
  };

  const handleAddVideos = (e: any) => {
    e.preventDefault(); // Prevent form submission
    videoAppend({
      title: '',
      videoId: ''
    });
  };

  const handleAddExperience = (e: any) => {
    e.preventDefault(); // Prevent form submission
    experienceAppend({
      title: '',
      company: '',
      year: '',
      description: '',
      yearStart: 2024
    });
  };

  return (
    <>
      <div className="position-relative">
        <h2 className="main-title">My Resume</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Intro & Overview</h4>
            <div className="dash-input-wrapper mb-35 md-mb-20">
              <label htmlFor="">Overview*</label>
              <textarea
                className="size-lg"
                placeholder="Write something interesting about you...."
                {...register('overview')}
                name="overview"
              ></textarea>

              <div className="alert-text">
                Brief description for your resume. URLs are hyperlinked.
              </div>
              {errors.overview?.message && (
                <ErrorMsg msg={errors.overview?.message} />
              )}
            </div>
          </div>

          {/* Video accrodion start */}
          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Videos</h4>

            {/* Add Education Start */}
            {videosArrayFields.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="accordion dash-accordion-one"
                  id={`accordionThree${index}`}
                >
                  <div className="accordion-item">
                    <div className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseThree${index}`}
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Add Videos*
                      </button>
                    </div>
                    <div
                      id={`collapseThree${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent={`#accordionThree${index}`}
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
                                placeholder="Your Video Title"
                                {...register(`videos.${index}.title`)}
                                name={`videos.${index}.title`}
                              />
                              {errors?.videos?.[index]?.title && (
                                <ErrorMsg
                                  msg={errors?.videos?.[index]?.title?.message}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-2">
                            <div className="dash-input-wrapper mb-30 md-mb-10">
                              <label htmlFor="">Video Id*</label>
                            </div>
                          </div>
                          <div className="col-lg-10">
                            <div className="dash-input-wrapper mb-30">
                              <input
                                type="text"
                                placeholder="Enter Video ID"
                                {...register(`videos.${index}.videoId`)}
                                name={`videos.${index}.videoId`}
                              />
                              {errors?.videos?.[index]?.videoId && (
                                <ErrorMsg
                                  msg={
                                    errors?.videos?.[index]?.videoId?.message
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <button
                            onClick={() => removeVideo(index)}
                            className="btn btn-danger w-auto  m-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Add Education End */}
            <button
              onClick={(e) => handleAddVideos(e)}
              className="dash-btn-one"
            >
              <i className="bi bi-plus"></i> Add more
            </button>
          </div>

          {/* Education start */}
          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Education</h4>

            {/* Add Education Start */}
            {educationArrayFields.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="accordion dash-accordion-one"
                  id={`accordionTwo${index}`}
                >
                  <div className="accordion-item">
                    <div className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseTwo${index}`}
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Add Education*
                      </button>
                    </div>
                    <div
                      id={`collapseTwo${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent={`#accordionTwo${index}`}
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
                                {...register(`education.${index}.title`)}
                                name={`education.${index}.title`}
                              />
                              {errors.education?.[index]?.title && (
                                <ErrorMsg
                                  msg={
                                    errors.education?.[index]?.title?.message
                                  }
                                />
                              )}
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
                                {...register(`education.${index}.academy`)}
                                name={`education.${index}.academy`}
                              />
                              {errors.education?.[index]?.academy && (
                                <ErrorMsg
                                  msg={
                                    errors.education?.[index]?.academy?.message
                                  }
                                />
                              )}
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
                                <div className="dash-input-wrapper mb-30">
                                  <select
                                    defaultValue=""
                                    {...register(
                                      `education.${index}.yearStart`,
                                      {
                                        setValueAs: (v) =>
                                          v === '' ? undefined : parseInt(v)
                                      }
                                    )}
                                    className="form-select"
                                  >
                                    <option value="" disabled>
                                      Year Start
                                    </option>
                                    {getLast30YearsOptions().map((year, i) => (
                                      <option key={i} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>

                                  {errors.education?.[index]?.yearStart && (
                                    <ErrorMsg
                                      msg={
                                        errors.education?.[index]?.yearStart
                                          ?.message
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="dash-input-wrapper mb-30">
                                  <select
                                    defaultValue=""
                                    {...register(`education.${index}.yearEnd`, {
                                      setValueAs: (v) =>
                                        v === '' ? undefined : parseInt(v)
                                    })}
                                    className="form-select"
                                  >
                                    <option value="" disabled>
                                      Year End
                                    </option>
                                    {getLast30YearsOptions().map((year, i) => (
                                      <option key={i} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>

                                  {errors.education?.[index]?.yearEnd && (
                                    <ErrorMsg
                                      msg={
                                        errors.education?.[index]?.yearEnd
                                          ?.message
                                      }
                                    />
                                  )}
                                </div>
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
                                {...register(`education.${index}.description`)}
                              ></textarea>
                              {errors.education?.[index]?.description && (
                                <ErrorMsg
                                  msg={
                                    errors.education?.[index]?.description
                                      ?.message
                                  }
                                />
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => educationRemove(index)}
                            className="btn btn-danger w-auto  m-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Add Education End */}
            <button
              onClick={(e) => handleAddEducation(e)}
              className="dash-btn-one"
            >
              <i className="bi bi-plus"></i> Add more
            </button>
          </div>
          {/* Education end */}

          {/* Experience start */}

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Skills & Experience</h4>

            <div className="dash-input-wrapper mb-15">
              <label htmlFor="">Add Work Experience*</label>
            </div>
            {experienceArrayFields.map((item, index) => {
              return (
                <div
                  className="accordion dash-accordion-one"
                  id={`accordionOne${index}`}
                  key={item.id}
                >
                  <div className="accordion-item">
                    <div className="accordion-header" id="headingOneA">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseOne${index}`}
                        aria-expanded="false"
                        aria-controls="accordionTwo"
                      >
                        Experience {index + 1}
                      </button>
                    </div>
                    <div
                      id={`collapseOne${index}`}
                      className="accordion-collapse collapse"
                      aria-labelledby="headingOneA"
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
                                placeholder="Lead Product Designer"
                                {...register(`experience.${index}.title`)}
                                name={`experience.${index}.title`}
                              />
                              {errors.experience?.[index]?.title?.message && (
                                <ErrorMsg
                                  msg={
                                    errors.experience?.[index]?.title?.message
                                  }
                                />
                              )}
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
                              <input
                                type="text"
                                placeholder="Amazon Inc"
                                {...register(`experience.${index}.company`)}
                                name={`experience.${index}.company`}
                              />
                              {errors.experience?.[index]?.company?.message && (
                                <ErrorMsg
                                  msg={
                                    errors.experience?.[index]?.company?.message
                                  }
                                />
                              )}
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
                                <div className="dash-input-wrapper mb-30">
                                  <select
                                    defaultValue=""
                                    {...register(
                                      `experience.${index}.yearStart`,
                                      {
                                        setValueAs: (v) =>
                                          v === '' ? undefined : parseInt(v)
                                      }
                                    )}
                                    className="form-select"
                                  >
                                    <option value="" disabled>
                                      Year Start
                                    </option>
                                    {getLast30YearsOptions().map((year, i) => (
                                      <option key={i} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>

                                  {errors.experience?.[index]?.yearStart
                                    ?.message && (
                                    <ErrorMsg
                                      msg={
                                        errors.experience?.[index]?.yearStart
                                          ?.message
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="dash-input-wrapper mb-30">
                                  <select
                                    defaultValue=""
                                    {...register(
                                      `experience.${index}.yearEnd`,
                                      {
                                        setValueAs: (v) =>
                                          v === '' ? undefined : parseInt(v)
                                      }
                                    )}
                                    className="form-select"
                                  >
                                    <option value="" disabled>
                                      Year End
                                    </option>
                                    {getLast30YearsOptions().map((year, i) => (
                                      <option key={i} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>

                                  {errors.experience?.[index]?.yearEnd
                                    ?.message && (
                                    <ErrorMsg
                                      msg={
                                        errors.experience?.[index]?.yearEnd
                                          ?.message
                                      }
                                    />
                                  )}
                                </div>
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
                                {...register(`experience.${index}.description`)}
                                name={`experience.${index}.description`}
                              ></textarea>
                              {errors.experience?.[index]?.description
                                ?.message && (
                                <ErrorMsg
                                  msg={
                                    errors.experience?.[index]?.description
                                      ?.message
                                  }
                                />
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => experienceRemove(index)}
                            className="btn btn-danger w-auto  m-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={(e) => handleAddExperience(e)}
              className="dash-btn-one"
            >
              <i className="bi bi-plus"></i> Add more
            </button>
          </div>
          {/* Experience end */}

          {/* Portfolio start */}

          <DashboardPortfolio
            setValue={setValue}
            portfolios={resume?.portfolio}
            className="mb-4 pt-6 px-6 border"
          />

          {/* Progress bar */}
          {isSubmitting && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progress}%
              </div>
            </div>
          )}

          <div className="button-group d-inline-flex align-items-center mt-30">
            <button
              type="submit"
              className="dash-btn-two tran3s me-3"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : isResumeExist
                  ? 'Update'
                  : 'Save'}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                reset();
              }}
              className="dash-cancel-btn tran3s"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* video modal start */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={'videoId' as string}
      />
      {/* video modal end */}
    </>
  );
};

export default DashboardResume;

/* eslint-disable no-undef */
'use client';
import React, { useState, useEffect } from 'react';
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

interface IProps {
  mongoUser: IUser;
  resume: IResumeType;
}

const DashboardResume = ({ mongoUser, resume }: IProps) => {
  const pathname = usePathname();
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [skillsTag, setSkillsTag] = useState<string[]>(
    resume?.skills || mongoUser?.skills || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoId, setVideoId] = useState<string | undefined>(
    resume?.videos?.[0]?.videoId ?? undefined
  );
  const [thumbnail, setThumbnail] = useState<string | undefined>(
    resume?.videos?.[0]?.videoId ?? undefined
  );

  const videoThumanail = `https://img.youtube.com/vi/${thumbnail}/0.jpg`;

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
      skills: resume?.skills || mongoUser?.skills || [],
      overview: resume?.overview || mongoUser.bio || '',
      minSalary: resume?.minSalary || mongoUser?.minSalary || '',
      maxSalary: resume?.maxSalary || mongoUser?.maxSalary || '',
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
          description: '',
          yearStart: 2020,
          yearEnd: 2023
        }
      ],
      education: groupedEducation || [
        {
          title: '',
          academy: '',
          year: '',
          description: '',
          yearStart: 2020,
          yearEnd: 2023
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
    clearErrors,
    setError,
    trigger,
    handleSubmit,

    // eslint-disable-next-line no-unused-vars
    formState: { errors },
    reset
  } = methods;

  const { fields: educationArrayFields, append: educationAppend } =
    useFieldArray({
      control,
      name: 'education'
    });

  const { fields: experienceArrayFields, append: experienceAppend } =
    useFieldArray({
      control,
      name: 'experience'
    });
  const { fields: videosArrayFields, append: videoAppend } = useFieldArray({
    control,
    name: 'videos'
  });

  // 2. Handle your form submission.
  const onSubmit = async (data: resumeSchemaType) => {
    setIsSubmitting(true);

    console.log('submtted data', data);
    const experience = data?.experience?.map((item: IExperience) => {
      const year = item?.yearStart + '-' + item?.yearEnd;
      return {
        title: item.title,
        company: item.company,
        yearStart: item.yearStart,
        yearEnd: item.yearEnd || 0,
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
        yearEnd: item.yearEnd || 0,
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
        skills: data.skills,
        overview: data.overview,
        experience,
        minSalary: data.minSalary,
        maxSalary: data.maxSalary,
        education,
        portfolio,
        videos
      };
      if (isResumeExist) {
        // update resume
        await updateResume({
          resumeId: resume?._id,
          resumeData,
          path: pathname
        });
        notifySuccess('Resume Updated successfully.');
      } else {
        await createResume(resumeData);
        notifySuccess('Resume Created successfully.');
      }
    } catch (error: any) {
      console.log(error);
      notifyError(error as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    reset();
  }, [reset]);

  // add skills
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field === 'skills') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value;

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return setError('skills', {
            type: 'required',
            message: 'Tag must be less than 15 characters.'
          });
        }
        // Retrieve current skills array
        const currentSkills = skillsTag || [];

        if (!skillsTag.includes(tagValue as never)) {
          setValue('skills', [...currentSkills, tagValue]);
          setSkillsTag([...currentSkills, tagValue]);
          tagInput.value = '';
          clearErrors('skills');
        }
      } else {
        trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, e: any) => {
    e.preventDefault();
    const newTags = skillsTag.filter((t: string) => t !== tag);
    setSkillsTag(newTags);
    setValue('skills', newTags);
  };

  const handleAddEducation = (e: any) => {
    e.preventDefault(); // Prevent form submission
    educationAppend({
      title: '',
      academy: '',
      year: '',
      description: '',
      yearStart: 2020,
      yearEnd: 2023
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
      yearStart: 2020,
      yearEnd: 2023
    });
  };

  const handleVideoClick = (
    videoId: string | undefined,
    thumbnail: string | undefined
  ) => {
    setVideoId(videoId);
    setThumbnail(thumbnail);
  };

  return (
    <>
      <div className="position-relative">
        <h2 className="main-title">My Resume</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white card-box border-20">
            <h4 className="dash-title-three">Resume Attachment</h4>
            {/* <div className="dash-input-wrapper mb-20">
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
            </div> */}

            <div className="dash-btn-one d-inline-block position-relative me-3">
              <i className="bi bi-plus"></i>
              Upload CV
              <input
                type="file"
                id="uploadCV"
                accept="application/pdf"
                placeholder="Up load resume"
                name="file"
              />
            </div>
            <small>{'Upload file .pdf'}</small>
          </div>

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

              <div className="d-flex align-items-center mb-3 mt-30">
                <label htmlFor="salaryStart" className="form-label me-4">
                  Salary *
                </label>
                <div className="d-flex gap-3">
                  <input
                    type="text"
                    defaultValue={resume?.minSalary}
                    placeholder="min salary"
                    {...register('minSalary', {
                      required: true,
                      valueAsNumber: true
                    })}
                    name="minSalary"
                    className=" mb-30 mx-8"
                  />
                  {errors?.minSalary?.message && (
                    <ErrorMsg msg={errors?.minSalary?.message} />
                  )}
                  <input
                    type="text"
                    defaultValue={resume?.maxSalary}
                    placeholder="max salary"
                    {...register('maxSalary', {
                      required: true,
                      valueAsNumber: true
                    })}
                    name="maxSalary"
                    className=" mb-30"
                  />
                  {errors?.maxSalary?.message && (
                    <ErrorMsg msg={errors?.maxSalary?.message} />
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 d-flex flex-column ">
                <div
                  className="intro-video-post d-flex align-items-center justify-content-center mt-25 lg-mt-20 mb-50 lg-mb-20"
                  style={{ backgroundImage: `url(${videoThumanail})` }}
                >
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="fancybox rounded-circle video-icon tran3s text-center cursor-pointer"
                  >
                    <i className="bi bi-play"></i>
                  </button>
                </div>
                <div className="mb-4 p-4">
                  <h3 className="title">videos </h3>
                  <div className="d-flex flex-wrap gap-4">
                    {resume?.videos?.map((video: IVideos, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-primary  p-3   text-white rounded-3 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleVideoClick(video?.videoId, video?.videoId);
                          }}
                        >
                          <div className="card-body ">
                            <h5 className="card-title fw-bold ">
                              {video?.title}{' '}
                            </h5>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-sm-6 d-flex">
                <div className="bg-white card-box border-20">
                  <h4 className="dash-title-three">Add Video</h4>
                  {/* Video add Start */}
                  {videosArrayFields.map((item, index) => {
                    return (
                      <div key={item.id}>
                        <div className="d-flex justify-content-center align-items-center gap-4">
                          <div className="dash-input-wrapper mb-30 md-mb-10">
                            <label htmlFor="">Title*</label>
                          </div>
                          <div className="dash-input-wrapper mb-30">
                            <input
                              type="text"
                              placeholder="Your Video Title"
                              {...register(`videos.${index}.title`)}
                              name={`videos.${index}.title`}
                            />
                            <ErrorMsg msg={errors?.videos?.message} />
                          </div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center gap-4">
                          <div className="dash-input-wrapper mb-30 md-mb-10">
                            <label htmlFor="">Video id*</label>
                          </div>
                          <div className="dash-input-wrapper mb-30">
                            <input
                              type="text"
                              placeholder="Enter Video ID"
                              {...register(`videos.${index}.videoId`)}
                              name={`videos.${index}.videoId`}
                            />
                            <ErrorMsg msg={errors?.videos?.message} />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Video add end */}
                  <button
                    onClick={(e) => handleAddVideos(e)}
                    className="dash-btn-one"
                  >
                    <i className="bi bi-plus"></i> Add more
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                              <ErrorMsg
                                msg={errors.education?.[index]?.title?.message}
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
                                {...register(`education.${index}.academy`)}
                                name={`education.${index}.academy`}
                              />
                              <ErrorMsg
                                msg={
                                  errors.education?.[index]?.academy?.message
                                }
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
                                <div className="dash-input-wrapper mb-30">
                                  <input
                                    type="number"
                                    placeholder="year start"
                                    {...register(
                                      `education.${index}.yearStart`,
                                      { valueAsNumber: true }
                                    )}
                                  />
                                  <ErrorMsg
                                    msg={
                                      errors.education?.[index]?.yearStart
                                        ?.message
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="dash-input-wrapper mb-30">
                                  <input
                                    type="number"
                                    placeholder="year end"
                                    {...register(`education.${index}.yearEnd`, {
                                      valueAsNumber: true
                                    })}
                                  />
                                  <ErrorMsg
                                    msg={
                                      errors.education?.[index]?.yearEnd
                                        ?.message
                                    }
                                  />
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
                              <ErrorMsg
                                msg={
                                  errors.education?.[index]?.description
                                    ?.message
                                }
                              />
                            </div>
                          </div>
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

          <div className="bg-white card-box border-20 mt-40">
            <h4 className="dash-title-three">Skills & Experience</h4>
            <div className="dash-input-wrapper mb-40">
              <label htmlFor="">Add Skills*</label>

              <div className="skills-wrapper">
                <div className="dash-input-wrapper mb-30">
                  <input
                    type="text"
                    placeholder="Add skills..."
                    onKeyDown={(e) => handleInputKeyDown(e, 'skills')}
                  />
                  <ErrorMsg msg={errors?.skills?.message} />
                </div>
                <ul className="style-none d-flex flex-wrap align-items-center">
                  {skillsTag?.map((item: any, index) => {
                    return (
                      <li className="is_tag" key={index}>
                        <button>
                          {item}{' '}
                          <i
                            className="bi bi-x"
                            onClick={(e) => handleTagRemove(item, e)}
                          ></i>
                        </button>
                      </li>
                    );
                  })}

                  {/* <li className="more_tag">
                      <button>+</button>
                    </li> */}
                </ul>
              </div>
            </div>

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
                              <ErrorMsg
                                msg={errors.experience?.[index]?.title?.message}
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
                              <input
                                type="text"
                                placeholder="Amazon Inc"
                                {...register(`experience.${index}.company`)}
                                name={`experience.${index}.company`}
                              />
                              <ErrorMsg
                                msg={
                                  errors.experience?.[index]?.company?.message
                                }
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
                                <div className="dash-input-wrapper mb-30">
                                  <input
                                    type="number"
                                    placeholder="year start"
                                    {...register(
                                      `experience.${index}.yearStart`,
                                      { valueAsNumber: true }
                                    )}
                                  />
                                  <ErrorMsg
                                    msg={
                                      errors.experience?.[index]?.yearStart
                                        ?.message
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-sm-6">
                                <div className="dash-input-wrapper mb-30">
                                  <input
                                    type="number"
                                    placeholder="year start"
                                    {...register(
                                      `experience.${index}.yearEnd`,
                                      { valueAsNumber: true }
                                    )}
                                  />
                                  <ErrorMsg
                                    msg={
                                      errors.experience?.[index]?.yearEnd
                                        ?.message
                                    }
                                  />
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
                              <ErrorMsg
                                msg={
                                  errors.experience?.[index]?.description
                                    ?.message
                                }
                              />
                            </div>
                          </div>
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

          <DashboardPortfolio
            setValue={setValue}
            portfolios={resume?.portfolio}
            className="mb-4 pt-6 px-6 border"
          />

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
        videoId={videoId as string}
      />
      {/* video modal end */}
    </>
  );
};

export default DashboardResume;

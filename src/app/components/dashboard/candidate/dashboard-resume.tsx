/* eslint-disable no-undef */
'use client';
import React, { useState } from 'react';
import video_bg from '@/assets/dashboard/images/video_post.jpg';
import DashboardPortfolio from './dashboard-portfolio';
import VideoPopup from '../../common/video-popup';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { resumeSchema } from '@/utils/validation';
import ErrorMsg from '../../common/error-msg';
import { createResume, updateResume } from '@/lib/actions/candidate.action';
import { useAuth } from '@clerk/nextjs';
import { notifyError, notifySuccess } from '@/utils/toast';
import { IEducation, IExperience, IResumeType } from '@/database/resume.model';
import { usePathname } from 'next/navigation';

interface IProps {
  mongoUserId: string | undefined;
  resume: IResumeType;
}

const DashboardResume = ({ mongoUserId, resume }: IProps) => {
  const pathname = usePathname();
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [skillsTag, setSkillsTag] = useState<string[]>(resume?.skills || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filename, setFilename] = useState(resume.pdf?.filename || '');
  const [file, setFile] = useState(resume?.pdf?.file || '');
  const isResumeExist = !!resume?._id;
  const { userId } = useAuth();
  const parsedMongoUserId = mongoUserId;

  const groupedExperience = resume?.experience.map((item: IExperience) => {
    return {
      title: item.title,
      company: item.company,
      year: item.year,
      description: item.description,
      yearStart: item.yearStart,
      yearEnd: item.yearEnd
    };
  });
  const groupedEducation = resume?.education.map((item: IEducation) => {
    return {
      title: item.title,
      academy: item.academy,
      year: item.year,
      description: item.description,
      yearStart: item.yearStart,
      yearEnd: item.yearEnd
    };
  });

  type resumeSchemaType = z.infer<typeof resumeSchema>;

  // 1. Define your form.
  const methods = useForm<resumeSchemaType>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      skills: resume?.skills || [],
      overview: resume?.overview || '',
      minSalary: resume?.minSalary || 0,
      maxSalary: resume?.maxSalary || 0,
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

  // handle file pdf upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const pdfFile = new FileReader();
    const selectedFile = event.target.files?.[0] || null;
    const fileName = selectedFile?.name || '';
    setFilename(fileName);
    if (event.target.name === 'file') {
      pdfFile.onload = () => {
        if (pdfFile.readyState === 2) {
          setFile(pdfFile.result as string);
        }
      };
    }
    pdfFile.readAsDataURL(event.target.files?.[0] as File);
  };

  // 2. Handle your form submission.
  const onSubmit = async (data: resumeSchemaType) => {
    setIsSubmitting(true);

    console.log(data);
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

    try {
      const resumeData: any = {
        clerkId: userId || null,
        user: parsedMongoUserId,
        skills: data.skills,
        overview: data.overview,
        experience,
        minSalary: data.minSalary as number,
        maxSalary: data.maxSalary as number,
        education,
        pdf: {
          filename,
          file
        }
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
      reset();
    }
  };

  // useEffect(() => {
  //   reset();
  // }, [reset]);

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
                onChange={(e) => handleFileChange(e)}
              />
            </div>
            <small>{filename || 'Upload file .pdf'}</small>
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
                  <input type="file" id="uploadVdo" placeholder="" />
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
                  <ErrorMsg msg={errors.skills?.message} />
                </div>
                <ul className="style-none d-flex flex-wrap align-items-center">
                  {skillsTag.map((item: any, index) => {
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

          <DashboardPortfolio />

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
        videoId={'-6ZbrfSRWKc'}
      />
      {/* video modal end */}
    </>
  );
};

export default DashboardResume;

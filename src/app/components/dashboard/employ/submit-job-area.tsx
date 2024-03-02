'use client';
import React, { useEffect, useState } from 'react';
import CitySelect from '../candidate/city-select';
import CountrySelect from '../candidate/country-select';
import EmployExperience from './employ-experience';
import { Controller, useForm } from 'react-hook-form';
import { skills } from '@/constants';
import { creatJobPost } from '@/lib/actions/job.action';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { notifyError, notifySuccess } from '@/utils/toast';
import { Country } from 'country-state-city';
import { formJobDataSchema } from '@/utils/validation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMsg from '../../common/error-msg';
import JobCategorySelect from './jobcategory-select';
import JobTypeSelect from './jobType-select';
import SalaryDurationSelect from './salary-duration-select';
import Select from 'react-select';
// props type
type IProps = {
  mongoUserId: string | undefined;
};

export interface IFormJobData {
  title: string;
  overview: string;
  duration: string;
  salary_duration: string;
  category: string;
  location: string;
  address?: {
    address: string;
    country: string;
    city: string;
    state: string;
    mapLocation?: string;
  };
  country: string;
  city: string;
  state: string;
  mapLocation?: string;
  salary: number;
  skills?: string[];
  experience: string;
  minSalary?: string;
  maxSalary?: string;
  industry: string;
  salaryRange: string;
  english_fluency: string;
}

const SubmitJobArea = ({ mongoUserId }: IProps) => {
  // const [skillTags, setSkillTags] = useState<string[]>(skills || []);
  // const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCountryDetails, setSelectedCountryDetails] = useState(
    {} as any
  );
  const { userId } = useAuth();

  const pathname = usePathname();
  const type = 'add';

  type IJobDataSchemaType = z.infer<typeof formJobDataSchema>;

  // react hook form
  const methods = useForm<IJobDataSchemaType>({
    resolver: zodResolver(formJobDataSchema),
    defaultValues: {
      title: '',
      overview: '',
      duration: '',
      salary_duration: '',
      category: '',
      location: '',
      country: '',
      city: '',
      experience: '',
      industry: '',
      english_fluency: ''
    }
  });
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { errors }
  } = methods;

  const selectedCountryName = watch('country');

  useEffect(() => {
    const selectedCountry = Country.getAllCountries().find(
      (country) => country.name === selectedCountryName
    );
    setSelectedCountryDetails(selectedCountry);
  }, [selectedCountryName]);

  const options = skills.map((skill) => ({ value: skill, label: skill }));

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

  // on submit
  const onSubmit = async (data: IJobDataSchemaType) => {
    console.log('data', data);
    setIsSubmitting(true);
    simulateProgress();
    const {
      title,
      category,
      english_fluency,
      overview,
      minSalary,
      maxSalary,
      salary_duration,
      skills,
      duration,
      location,
      experience,
      industry,
      address,
      country,
      city
    } = data;

    const mongoData = {
      title,
      category,
      english_fluency,
      overview,
      salary_duration,
      experience,
      skills,
      duration,
      location,
      address,
      minSalary,
      maxSalary,
      country,
      city,
      industry
    };

    try {
      if (type === 'add') {
        // !Error: this function is calling two times
        await creatJobPost({
          data: mongoData,
          clerkId: userId,
          createdBy: mongoUserId,
          path: pathname
        });
        setProgress(100);
        notifySuccess('Job post created successfully!');
      }
    } catch (error: any) {
      console.log('onSubmit  error:', error);
      notifyError(error);
      setProgress(0);
    } finally {
      reset();
      setProgress(0);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="position-relative">
      {/* form start */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="main-title">Post a New Job</h2>
        <div className="bg-white card-box border-20">
          <h4 className="dash-title-three">Job Details</h4>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Job Title*</label>
            <input
              type="text"
              placeholder="Ex: Product Designer"
              {...register('title', { required: `Title is required!` })}
              name="title"
            />
            {errors?.title && <ErrorMsg msg={errors?.title.message} />}
          </div>
          <div className="dash-input-wrapper mb-30">
            <label htmlFor="">Job Description*</label>
            <textarea
              className="size-lg"
              placeholder="Write about the job in details..."
              {...register('overview', {
                required: `Description is required!`
              })}
              name="overview"
            ></textarea>
            {errors?.overview && <ErrorMsg msg={errors?.overview.message} />}
          </div>
          <div className="row align-items-end">
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Job Category</label>
                <JobCategorySelect register={register} />
                {errors?.category && (
                  <ErrorMsg msg={errors?.category?.message} />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Job Type</label>
                <JobTypeSelect register={register} />
                {errors?.duration && (
                  <ErrorMsg msg={errors?.duration.message} />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Salary*</label>
                <SalaryDurationSelect register={register} />
                {errors?.salary_duration && (
                  <ErrorMsg msg={errors?.salary_duration.message} />
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="dash-input-wrapper mb-30">
                <input
                  type="number"
                  // defaultValue={0}
                  placeholder="Min Salary"
                  {...register('minSalary', {
                    setValueAs: (v) => (v === '' ? undefined : parseInt(v))
                  })}
                  name="minSalary"
                />
                {errors?.minSalary && (
                  <ErrorMsg msg={errors?.minSalary.message} />
                )}
              </div>
            </div>
            <div className="col-md-3">
              <div className="dash-input-wrapper mb-30">
                <input
                  type="number"
                  placeholder="Max salary"
                  {...register('maxSalary', {
                    setValueAs: (v) => (v === '' ? undefined : parseInt(v))
                  })}
                  name="maxSalary"
                />
                {errors?.maxSalary && (
                  <ErrorMsg msg={errors?.maxSalary.message} />
                )}
              </div>
            </div>
          </div>

          <h4 className="dash-title-three pt-50 lg-pt-30">
            Skills & Experience
          </h4>
          <div className=" mb-30">
            <label className="fw-semibold  mb-3 " htmlFor="">
              Skills*
            </label>
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  {...field}
                  //@ts-ignore
                  options={options}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(selectedOption) =>
                    field.onChange(
                      selectedOption?.map(
                        (option) => option?.value as string | null
                      )
                    )
                  }
                  value={field.value?.map((val) =>
                    val ? { value: val, label: val } : null
                  )}
                />
              )}
            />
            {errors?.skills && <ErrorMsg msg={errors?.skills.message} />}
          </div>

          {/* employ experience start */}
          <EmployExperience control={control} errors={errors} />
          {/* employ experience end */}
          <h4 className="dash-title-three pt-50 lg-pt-30">File Attachment</h4>
          <div className="dash-input-wrapper mb-20">
            <label htmlFor="">File Attachment*</label>
            <div className="attached-file d-flex align-items-center justify-content-between mb-15">
              <span>guidline&requirments.doc</span>
              <a href="#" className="remove-btn">
                <i className="bi bi-x"></i>
              </a>
            </div>
          </div>
          <div className="dash-btn-one d-inline-block position-relative me-3">
            <i className="bi bi-plus"></i>
            Upload File
            <div id="uploadCV"></div>
          </div>
          <small>Upload file .pdf, .doc, .docx</small>
          <h4 className="dash-title-three pt-50 lg-pt-30">
            Address & Location
          </h4>
          <div className="row">
            <div className="col-12">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Address*</label>
                <input
                  type="text"
                  placeholder="Cowrasta, Chandana, Gazipur Sadar"
                  {...register('address', {
                    required: `Address is required!`
                  })}
                  name="address"
                />
                {errors?.address && <ErrorMsg msg={errors?.address.message} />}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">Country*</label>
                <CountrySelect register={register} />
                {errors?.country && <ErrorMsg msg={errors?.country.message} />}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="dash-input-wrapper mb-25">
                <label htmlFor="">City*</label>
                <CitySelect
                  register={register}
                  countryCode={selectedCountryDetails?.isoCode || ''}
                />
                {errors?.city && <ErrorMsg msg={errors?.city.message} />}
              </div>
            </div>
          </div>
        </div>

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
            disabled={isSubmitting}
            type="submit"
            className="dash-btn-two tran3s me-3"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button onClick={() => reset()} className="dash-cancel-btn tran3s">
            Cancel
          </button>
        </div>
      </form>

      {/* form end */}
    </div>
  );
};

export default SubmitJobArea;

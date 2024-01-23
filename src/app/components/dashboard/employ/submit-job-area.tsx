'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import DashboardHeader from '../candidate/dashboard-header';
import StateSelect from '../candidate/state-select';
import CitySelect from '../candidate/city-select';
import CountrySelect from '../candidate/country-select';
import EmployExperience from './employ-experience';
import icon from '@/assets/dashboard/images/icon/icon_16.svg';
import NiceSelect from '@/ui/nice-select';
import { Resolver, useForm, FormProvider } from 'react-hook-form';
import { skills } from '@/constants';
import { creatJobPost } from '@/lib/actions/job.action';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { notifyError, notifySuccess } from '@/utils/toast';

// props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  mongoUserId: string | undefined;
};

// interface IAddress {
//   address: string;
//   country: string;
//   city: string;
//   state: string;
//   mapLocation?: string;
// }

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
  tags?: string[];
  experience: string;
  minSalary?: string;
  maxSalary?: string;
  industry: string;
  salaryRange: string;
  english_fluency: string;
}

// interface ISkills {
//   value: string;
// }

// resolver
const resolver: Resolver<IFormJobData> = async (values) => {
  return {
    values: values.title ? values : {},
    errors: !values.title
      ? {
          title: { type: 'required', message: 'Title is required.' },
          overview: { type: 'required', message: 'Overview is required.' },
          category: { type: 'required', message: 'Category is required.' },
          duration: { type: 'required', message: 'Duration is required.' },
          salary_duration: { type: 'required', message: 'Salary is required.' },
          salary: { type: 'required', message: 'Salary is required.' },

          // minSalary: { type: 'required', message: 'Min is required.' },
          // maxSalary: { type: 'required', message: 'Max is required.' },
          // salaryRange: { type: 'required', message: 'Salary Range is required.' },
          skills: { type: 'required', message: 'Skills is required.' },
          experience: { type: 'required', message: 'Experience is required.' },
          industry: { type: 'required', message: 'Industry is required.' },
          address: { type: 'required', message: 'Address is required.' },
          country: { type: 'required', message: 'Country is required.' },
          city: { type: 'required', message: 'City is required.' },
          state: { type: 'required', message: 'State is required.' },
          location: { type: 'required', message: 'Location is required.' }
        }
      : {}
  };
};

const SubmitJobArea = ({ setIsOpenSidebar, mongoUserId }: IProps) => {
  const [skillTags, setSkillTags] = useState<string[]>(skills);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const type = 'add';
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]);

  // react hook form
  const methods = useForm({ resolver });

  // react hook form
  const {
    register,
    setValue,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
    reset
  } = methods;

  const handleSkillButton = (value: string) => {
    const index = skillTags.indexOf(value);
    if (index !== -1) {
      skillTags.splice(index, 1); // Remove the skill
      setSkillTags([...skillTags]); // Trigger re-render
    }

    // Add to selected skills only if not already present
    if (!selectedSkills.includes(value)) {
      setSelectedSkills([...selectedSkills, value]);
      setValue('tags', [...selectedSkills]);
    }
  };

  const handleCategory = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('category', value);
  };
  const handleJobType = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('duration', value);
  };
  const handleSalary = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('salary_duration', value);
  };

  // on submit
  const onSubmit = async (data: IFormJobData) => {
    setIsSubmitting(true);

    const {
      title,
      category,
      english_fluency,
      overview,
      minSalary,
      maxSalary,
      salaryRange,
      salary_duration,
      tags,
      duration,
      location,
      experience,
      industry,
      address,
      country,
      state,
      salary,
      city
    } = data;

    if (minSalary && maxSalary) {
      data.salaryRange = `${minSalary} - ${maxSalary}`;
    }
    // if (address?.address && country && state && city) {
    //   setValue('address', {
    //     address: address?.address,
    //     country,
    //     state,
    //     city
    //   });
    // }

    const mongoData = {
      title,
      category,
      english_fluency,
      overview,
      salaryRange,
      salary_duration,
      experience,
      tags,
      duration,
      location,
      address,
      minSalary,
      maxSalary,
      salary,
      country,
      city,
      state,
      industry
    };

    try {
      if (type === 'add') {
        setCount(count + 1);
        // !Error: this function is calling two times
        await creatJobPost({
          data: mongoData,
          clerkId: userId,
          createdBy: mongoUserId,
          path: pathname
        });

        notifySuccess('Job post created successfully!');
        router.push('/jobs');
        reset();
      }
    } catch (error: any) {
      console.log('onSubmit  error:', error);
      notifyError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        {/* header end */}

        {/* form start */}
        <FormProvider {...methods}>
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
              </div>
              <div className="row align-items-end">
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Job Category</label>
                    <NiceSelect
                      options={[
                        { value: 'Designer', label: 'Designer' },
                        {
                          value: 'It & Development',
                          label: 'It & Development'
                        },
                        {
                          value: 'Web & Mobile Dev',
                          label: 'Web & Mobile Dev'
                        },
                        { value: 'Writing', label: 'Writing' }
                      ]}
                      defaultCurrent={0}
                      onChange={(item) => handleCategory(item)}
                      name="category"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Job Type</label>
                    <NiceSelect
                      options={[
                        { value: 'Full time', label: 'Full time' },
                        { value: 'Part time', label: 'Part time' },
                        { value: 'Hourly-Contract', label: 'Hourly-Contract' },
                        { value: 'Fixed-Price', label: 'Fixed-Price' }
                      ]}
                      defaultCurrent={0}
                      onChange={(item) => handleJobType(item)}
                      name="duration"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dash-input-wrapper mb-30">
                    <label htmlFor="">Salary*</label>
                    <NiceSelect
                      options={[
                        { value: 'Monthly', label: 'Monthly' },
                        { value: 'Weekly', label: 'Weekly' }
                      ]}
                      defaultCurrent={0}
                      onChange={(item: any) => handleSalary(item)}
                      name="salary_duration"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="dash-input-wrapper mb-30">
                    <input
                      type="text"
                      placeholder="salary"
                      {...register('salary')}
                      name="salary"
                    />
                  </div>
                  <div className="dash-input-wrapper mb-30">
                    <input
                      type="text"
                      placeholder="Min"
                      {...register('minSalary')}
                      name="minSalary"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="dash-input-wrapper mb-30">
                    <input
                      type="text"
                      placeholder="Max"
                      {...register('maxSalary')}
                      name="maxSalary"
                    />
                  </div>
                </div>
              </div>

              <h4 className="dash-title-three pt-50 lg-pt-30">
                Skills & Experience
              </h4>
              <div className="dash-input-wrapper mb-30">
                <label htmlFor="">Skills*</label>
                <input
                  type="text"
                  placeholder="Add Skills"
                  {...register('tags', { required: `Skills is required!` })}
                  name="tags"
                  value={selectedSkills.join(', ')}
                />
                <div className="skill-input-data d-flex align-items-center flex-wrap">
                  {skillTags.map((skill, index) => (
                    <button
                      key={skill + index}
                      onClick={() => handleSkillButton(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* employ experience start */}
              <EmployExperience />
              {/* employ experience end */}
              <h4 className="dash-title-three pt-50 lg-pt-30">
                File Attachment
              </h4>
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
                <input
                  type="file"
                  id="uploadCV"
                  name="uploadCV"
                  placeholder=""
                />
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
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">Country*</label>
                    <CountrySelect />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">City*</label>
                    <CitySelect />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">State*</label>
                    <StateSelect />
                  </div>
                </div>
                <div className="col-12">
                  <div className="dash-input-wrapper mb-25">
                    <label htmlFor="">Map Location*</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        placeholder="XC23+6XC, Moiran, N105"
                        {...register('mapLocation')}
                        name="mapLocation"
                      />
                      <button className="location-pin tran3s">
                        <Image
                          src={icon}
                          alt="icon"
                          className="lazy-img m-auto"
                        />
                      </button>
                    </div>
                    <div className="map-frame mt-30">
                      <div className="gmap_canvas h-100 w-100">
                        <iframe
                          className="gmap_iframe h-100 w-100"
                          src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=bass hill plaza medical centre&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="button-group d-inline-flex align-items-center mt-30">
              <button
                disabled={isSubmitting}
                type="submit"
                className="dash-btn-two tran3s me-3"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                onClick={() => reset()}
                className="dash-cancel-btn tran3s"
              >
                Cancel
              </button>
            </div>
          </form>
        </FormProvider>

        {/* form end */}
      </div>
    </div>
  );
};

export default SubmitJobArea;

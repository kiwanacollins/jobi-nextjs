'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import DashboardHeader from '../candidate/dashboard-header';
import StateSelect from '../candidate/state-select';
import CitySelect from '../candidate/city-select';
import CountrySelect from '../candidate/country-select';
import EmployExperience from './employ-experience';
import icon from '@/assets/dashboard/images/icon/icon_16.svg';
import NiceSelect from '@/ui/nice-select';
import { Resolver, useForm } from 'react-hook-form';
import { skills } from '@/constants';

// props type
type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface IJobData {
  id: number;
  logo: string;
  title: string;
  duration: string;
  date: string;
  company: string;
  location: string;
  category: string;
  tags?: string[];
  experience: string;
  salary: number;
  minSalary?: number;
  maxSalary?: number;
  salary_duration: string;
  english_fluency: string;
  overview: string;
}

interface ISkills {
  value: string;
}

// resolver
const resolver: Resolver<IJobData> = async (values) => {
  return {
    values: values.title ? values : {},
    errors: !values.title
      ? {
          title: { type: 'required', message: 'Title is required.' },
          overview: { type: 'required', message: 'Overview is required.' },
          category: { type: 'required', message: 'Category is required.' },
          duration: { type: 'required', message: 'Duration is required.' },
          salary: { type: 'required', message: 'Salary is required.' },
          // minSalary: { type: 'required', message: 'Min is required.' },
          // maxSalary: { type: 'required', message: 'Max is required.' },
          skills: { type: 'required', message: 'Skills is required.' },
          experience: { type: 'required', message: 'Experience is required.' },
          address: { type: 'required', message: 'Address is required.' },
          country: { type: 'required', message: 'Country is required.' },
          city: { type: 'required', message: 'City is required.' },
          state: { type: 'required', message: 'State is required.' },
          location: { type: 'required', message: 'Location is required.' }
        }
      : {}
  };
};

const SubmitJobArea = ({ setIsOpenSidebar }: IProps) => {
  const [skillTags, setSkillTags] = useState<string[]>(skills);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillButton = (value: string) => {
    // Create a copy of the skills array without the clicked skill
    const updatedSkills = skillTags.filter((skill) => skill !== value);

    const matchedSkill = skillTags.find((skill) => skill === value) as string;

    if (selectedSkills.indexOf(matchedSkill) === -1) {
      setSelectedSkills([...selectedSkills, matchedSkill]);
    }

    // Update the state with the new array
    setSkillTags(updatedSkills);
  };

  // react hook form
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    reset
  } = useForm<IJobData>({ resolver });

  const handleCategory = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('category', value);
  };
  const handleJobType = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('duration', value);
  };
  const handleSalary = (item: { value: number; label: string }) => {
    const { value } = item;
    setValue('salary', value);
  };

  // on submit
  const onSubmit = (data: any) => {
    setValue('tags', selectedSkills);
    getValues('experience');
    getValues('location');
    getValues('english_fluency');

    console.log(data);
  };
  return (
    <div className="dashboard-body">
      <div className="position-relative">
        {/* header start */}
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />
        {/* header end */}

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
                  required: `Descript is required!`
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
                      { value: 'It & Development', label: 'It & Development' },
                      { value: 'Web & Mobile Dev', label: 'Web & Mobile Dev' },
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
                    name="Salary"
                  />
                </div>
              </div>
              <div className="col-md-3">
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
            <EmployExperience setValue={setValue} />
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
              <input type="file" id="uploadCV" name="uploadCV" placeholder="" />
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
                    <input type="text" placeholder="XC23+6XC, Moiran, N105" />
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
            <button type="submit" className="dash-btn-two tran3s me-3">
              Submit
            </button>
            <a href="#" className="dash-cancel-btn tran3s">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitJobArea;

import NiceSelect from '@/ui/nice-select';
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { IFormJobData } from './submit-job-area';

const EmployExperience = ({
  setValue
}: {
  setValue: UseFormSetValue<IFormJobData>;
}) => {
  const handleExperience = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('experience', value);
  };
  const handleLocation = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('location', value);
  };
  const handleIndustry = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('industry', value);
  };
  const handleEnglishFluency = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('english_fluency', value);
  };
  return (
    <div className="row align-items-end">
      <div className="col-md-6">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Experience*</label>
          <NiceSelect
            options={[
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'No-Experience', label: 'No-Experience' },
              { value: 'Expert', label: 'Expert' }
            ]}
            defaultCurrent={0}
            onChange={(item) => handleExperience(item)}
            name="experience"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Location*</label>
          <NiceSelect
            options={[
              { value: 'Washington DC', label: 'Washington DC' },
              { value: 'California, CA', label: 'California, CA' },
              { value: 'New York', label: 'New York' },
              { value: 'Miami', label: 'Miami' }
            ]}
            defaultCurrent={0}
            onChange={(item) => handleLocation(item)}
            name="location"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">Industry*</label>
          <NiceSelect
            options={[
              { value: 'Select Industry', label: 'Select Industry' },
              { value: 'Select Industry 2', label: 'Select Industry 2' }
            ]}
            defaultCurrent={0}
            onChange={(item) => handleIndustry(item)}
            name="industry"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="dash-input-wrapper mb-30">
          <label htmlFor="">English Fluency</label>
          <NiceSelect
            options={[
              { value: 'Basic', label: 'Basic' },
              { value: 'Conversational', label: 'Conversational' },
              { value: 'Fluent', label: 'Fluent' },
              { value: 'Native/Bilingual', label: 'Native/Bilingual' }
            ]}
            defaultCurrent={0}
            onChange={(item) => handleEnglishFluency(item)}
            name="english_fluency"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployExperience;

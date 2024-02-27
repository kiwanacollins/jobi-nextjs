'use client';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ICountrySelect {
  register: UseFormRegister<any>;
}

const JobTypeSelect = ({ register }: ICountrySelect) => {
  const jobTypes = [
    { value: 'Full time', label: 'Full time' },
    { value: 'Part time', label: 'Part time' },
    { value: 'Hourly-Contract', label: 'Hourly-Contract' },
    { value: 'Fixed-Price', label: 'Fixed-Price' }
  ];
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      {...register('duration', { required: true })}
    >
      <option value="" disabled>
        select duration
      </option>
      {jobTypes?.map((type, i) => {
        return (
          <option key={i} value={type.value}>
            {type.label}
          </option>
        );
      })}
    </select>
  );
};

export default JobTypeSelect;

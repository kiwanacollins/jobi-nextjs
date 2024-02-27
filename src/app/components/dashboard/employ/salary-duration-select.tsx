'use client';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ICountrySelect {
  register: UseFormRegister<any>;
}

const SalaryDurationSelect = ({ register }: ICountrySelect) => {
  const salaryDurations = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Yearly', label: 'Yearly' }
  ];
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      {...register('salary_duration', { required: true })}
    >
      <option value="" disabled>
        select duration
      </option>
      {salaryDurations?.map((duration, i) => {
        return (
          <option key={i} value={duration.value}>
            {duration.label}
          </option>
        );
      })}
    </select>
  );
};

export default SalaryDurationSelect;

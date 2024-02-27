'use client';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ICountrySelect {
  register: UseFormRegister<any>;
}

const JobCategorySelect = ({ register }: ICountrySelect) => {
  const categories = [
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
  ];
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      {...register('category', { required: true })}
    >
      <option value="" disabled>
        select category
      </option>
      {categories?.map((category, i) => {
        return (
          <option key={i} value={category.value}>
            {category.label}
          </option>
        );
      })}
    </select>
  );
};

export default JobCategorySelect;

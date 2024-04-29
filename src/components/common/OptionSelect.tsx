'use client';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ICountrySelect {
  register: UseFormRegister<any>;
  options: { value: string; label: string }[];
  name: string;
}

const OptionSelect = ({ register, options, name }: ICountrySelect) => {
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      defaultValue={''}
      {...register(`${name}`)}
    >
      <option value="" disabled>
        select {name}
      </option>
      {options?.map((option, i) => {
        return (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </select>
  );
};

export default OptionSelect;

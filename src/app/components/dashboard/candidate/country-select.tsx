'use client';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Country, ICountry } from 'country-state-city';

interface ICountrySelect {
  register: UseFormRegister<any>;
}
export const countries: ICountry[] = Country.getAllCountries();

const CountrySelect = ({ register }: ICountrySelect) => {
  return (
    <select
      className="form-select"
      aria-label="Default select example"
      {...register('country', { required: true })}
    >
      <option value="" disabled>
        select country
      </option>
      {countries?.map((country, i) => {
        return (
          <option key={i} value={country.name}>
            {country.name}
          </option>
        );
      })}
    </select>
  );
};

export default CountrySelect;

import { City, ICity } from 'country-state-city';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface ICitySelect {
  register: UseFormRegister<any>;
  countryCode: string | undefined;
}

const CitySelect = ({ register, countryCode }: ICitySelect) => {
  console.log('countryCode', countryCode);
  let cities: ICity[] | undefined = [];

  if (countryCode) {
    cities = City.getCitiesOfCountry(countryCode);
  }

  return (
    <select
      className="form-select"
      aria-label="Default select example"
      {...register('city', { required: true })}
    >
      <option value="" disabled>
        select city
      </option>
      {cities?.map((city, i) => {
        return (
          <option key={i} value={city.name}>
            {city.name}
          </option>
        );
      })}
    </select>
  );
};

export default CitySelect;

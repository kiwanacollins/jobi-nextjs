'use client';
import NiceSelect from '@/ui/nice-select';
import React from 'react';
import { useFormContext } from 'react-hook-form';

const CountrySelect = () => {
  const { setValue } = useFormContext() ?? {};
  const handleCountry = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('country', value);
  };
  return (
    <NiceSelect
      options={[
        { value: 'Afghanistan', label: 'Afghanistan' },
        { value: 'Albania', label: 'Albania' },
        { value: 'Belgium', label: 'Belgium' },
        { value: 'Barbados', label: 'Barbados' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Angola', label: 'Angola' },
        { value: 'Austria', label: 'Austria' }
      ]}
      defaultCurrent={0}
      onChange={(item) => handleCountry(item)}
      name="country"
    />
  );
};

export default CountrySelect;

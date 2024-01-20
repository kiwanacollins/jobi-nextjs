import NiceSelect from '@/ui/nice-select';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { IFormJobData } from '../employ/submit-job-area';

const CitySelect = () => {
  const { setValue } = useFormContext<IFormJobData>();
  const handleCity = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('city', value);
  };
  return (
    <NiceSelect
      options={[
        { value: 'Sydney', label: 'Sydney' },
        { value: 'Tokyo', label: 'Tokyo' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Shanghai', label: 'Shanghai' },
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Bangalore', label: 'Bangalore' }
      ]}
      defaultCurrent={0}
      onChange={(item) => handleCity(item)}
      name="city"
    />
  );
};

export default CitySelect;

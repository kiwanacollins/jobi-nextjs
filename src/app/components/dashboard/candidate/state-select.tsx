import React from 'react';
import NiceSelect from '@/ui/nice-select';
import { UseFormSetValue } from 'react-hook-form';
import { IFormJobData } from '../employ/submit-job-area';

const StateSelect = ({
  setValue
}: {
  setValue: UseFormSetValue<IFormJobData>;
}) => {
  const handleState = (item: { value: string; label: string }) => {
    const { value } = item;
    setValue('state', value);
    console.log(value);
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
      onChange={(item) => handleState(item)}
      name="state"
    />
  );
};

export default StateSelect;

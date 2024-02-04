import React from 'react';
import NiceSelect from '@/ui/nice-select';
import { UseFormSetValue } from 'react-hook-form';

const StateSelect = ({ setValue }: { setValue: UseFormSetValue<any> }) => {
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

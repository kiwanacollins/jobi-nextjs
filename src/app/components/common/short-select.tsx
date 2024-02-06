'use client';
import React from 'react';
import NiceSelect from '@/ui/nice-select';
import { useAppDispatch } from '@/redux/hook';
import { setJobType } from '@/redux/features/filterSlice';

const ShortSelect = () => {
  const dispatch = useAppDispatch();
  // handleShort
  const handleShort = (item: { value: string; label: string }) => {
    dispatch(setJobType(item.value));
  };
  return (
    <NiceSelect
      options={[
        { value: 'New', label: 'New' },
        { value: 'Category', label: 'Category' },
        { value: 'Job Type', label: 'Job Type' }
      ]}
      defaultCurrent={0}
      onChange={(item) => handleShort(item)}
      name="Short by"
    />
  );
};

export default ShortSelect;

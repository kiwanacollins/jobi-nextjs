'use client';
import React, { useState } from 'react';
import NiceSelect from '@/ui/nice-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';

const SelectCandidateType = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender');
  const [active, setActive] = useState(gender || '');
  const handleCandidateType = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'gender',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'gender',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <NiceSelect
      options={[
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
      ]}
      defaultCurrent={0}
      onChange={(item) => handleCandidateType(item)}
      name="Qualification"
    />
  );
};

export default SelectCandidateType;

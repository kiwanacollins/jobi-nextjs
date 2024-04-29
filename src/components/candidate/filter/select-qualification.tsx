'use client';
import React, { useState } from 'react';
import NiceSelect from '@/ui/nice-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';

const SelectCandidateQualification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qualification = searchParams.get('qualification');
  const [active, setActive] = useState(qualification || '');
  const handleQualification = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'qualification',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'qualification',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <NiceSelect
      options={[
        { value: `master's degree`, label: `Master's Degree` },
        { value: `bachelor degree`, label: `Bachelor Degree` },
        { value: `None`, label: `None` }
      ]}
      defaultCurrent={0}
      onChange={(item) => handleQualification(item)}
      name="Qualification"
    />
  );
};

export default SelectCandidateQualification;

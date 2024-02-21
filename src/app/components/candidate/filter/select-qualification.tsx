'use client';
import React, { useState } from 'react';
import candidate_data from '@/data/candidate-data';
import NiceSelect from '@/ui/nice-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';

const SelectCandidateQualification = () => {
  const uniqueQualification = [
    ...new Set(candidate_data.map((c) => c.qualification))
  ];
  const options = uniqueQualification.map((l) => {
    return { value: l, label: l };
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const experience = searchParams.get('experience');
  const [active, setActive] = useState(experience || '');
  const handleQualification = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'experience',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'experience',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <NiceSelect
      options={options}
      defaultCurrent={0}
      onChange={(item) => handleQualification(item)}
      name="Qualification"
    />
  );
};

export default SelectCandidateQualification;

'use client';
import React, { useState } from 'react';
import candidate_data from '@/data/candidate-data';
import NiceSelect from '@/ui/nice-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';

const FilterSkills = () => {
  const uniqueSkills = [...new Set(candidate_data.flatMap((c) => c.skills))];
  const options = uniqueSkills.map((c) => {
    return { value: c, label: c };
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const skill = searchParams.get('skill');
  const [active, setActive] = useState(skill || '');
  const handleSkills = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'skill',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'skill',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <NiceSelect
      options={options}
      defaultCurrent={0}
      onChange={(item) => handleSkills(item)}
      cls="bg-white"
      name="Category"
    />
  );
};

export default FilterSkills;

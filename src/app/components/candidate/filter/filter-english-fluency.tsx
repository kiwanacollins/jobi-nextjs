'use client';
import NiceSelect from '@/ui/nice-select';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';

const FilterEnglishFluency = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fluency = searchParams.get('fluency');
  const [active, setActive] = useState(fluency || '');
  const handleEnglishFluency = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'fluency',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'fluency',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <NiceSelect
      options={[
        { value: 'Basic', label: 'Basic' },
        { value: 'Conversational', label: 'Conversational' },
        { value: 'Fluent', label: 'Fluent' },
        { value: 'Native/Bilingual', label: 'Native/Bilingual' }
      ]}
      defaultCurrent={0}
      onChange={(item) => handleEnglishFluency(item)}
      name="English Fluency"
      placeholder="English Fluency"
      cls="bg-white"
    />
  );
};

export default FilterEnglishFluency;

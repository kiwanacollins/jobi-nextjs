'use client';
import NiceSelect from '@/ui/nice-select';
import { formUrlQuery } from '@/utils/utils';
import { City } from 'country-state-city';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const FilterCandidateLocation = () => {
  const cities = City.getCitiesOfCountry('BD');
  const uniqueLocations = [...new Set(cities?.map((c) => c.name))];
  const options = uniqueLocations.map((l) => {
    return { value: l, label: l };
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const [active, setActive] = useState(location || '');
  const handleLocation = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'location',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'location',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <NiceSelect
      options={options}
      defaultCurrent={0}
      onChange={(item) => handleLocation(item)}
      name="Location"
    />
  );
};

export default FilterCandidateLocation;

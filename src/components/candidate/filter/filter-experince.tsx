'use client';
import React, { useState } from 'react';
import candidate_data from '@/data/candidate-data';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';

const FilterCandidateExperience = () => {
  const uniqueExperiences = [
    ...new Set(candidate_data.map((c) => c.experience))
  ];
  const router = useRouter();
  const searchParams = useSearchParams();
  const experience = searchParams.get('experience');
  const [active, setActive] = useState(experience || '');
  // handle Experience
  const handleExperience = (e: any) => {
    const newExperience = e.target.value;
    if (active === newExperience) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'experience',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(newExperience);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'experience',
        value: newExperience.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <ul className="style-none filter-input">
      {uniqueExperiences.map((e, index) => (
        <li key={index}>
          <input
            onChange={(e) => handleExperience(e)}
            type="checkbox"
            name="experience"
            defaultValue={e}
            checked={active === e}
          />
          <label>{e}</label>
        </li>
      ))}
    </ul>
  );
};

export default FilterCandidateExperience;

'use client';
import React, { useEffect, useState } from 'react';
import NiceSelect from '@/ui/nice-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';
import { getCategoriesAndSubcategories } from '@/lib/actions/category.action';

const FilterSkills = () => {
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const uniqueSkills = [...new Set(subcategories?.flatMap((c) => c))];
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

  useEffect(() => {
    const fetchAllCategories = async () => {
      const res = await getCategoriesAndSubcategories();
      setSubcategories(res?.subcategories);
    };
    fetchAllCategories(); // Remove the 'return' statement
  }, []);

  return (
    <NiceSelect
      options={options}
      defaultCurrent={0}
      onChange={(item) => handleSkills(item)}
      cls="bg-white"
      placeholder="Select Skills"
      name="Category"
    />
  );
};

export default FilterSkills;

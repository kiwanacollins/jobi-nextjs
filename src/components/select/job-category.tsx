'use client';
import React, { useEffect, useState } from 'react';
import NiceSelect from '@/ui/nice-select';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';
import { getCategoriesAndSubcategories } from '@/lib/actions/category.action';

const JobCategorySelect = () => {
  const [categoryData, setCategoryData] = useState<string[]>([]);
  const uniqueCategories = [
    ...new Set(categoryData?.flatMap((category) => category))
  ];
  // category_option
  const category_option = uniqueCategories.map((category) => {
    return {
      value: category,
      label: category
    };
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [active, setActive] = useState(category || '');
  const handleCategory = (item: { value: string; label: string }) => {
    if (active === item.value) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'category',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item.value);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'category',
        value: item.value.toLowerCase()
      });

      router.push(newUrl, { scroll: false });
    }
  };

  useEffect(() => {
    const fetchAllCategories = async () => {
      const res = await getCategoriesAndSubcategories();

      setCategoryData(res?.categories);
    };
    fetchAllCategories(); // Remove the 'return' statement
  }, []);
  return (
    <NiceSelect
      options={category_option}
      defaultCurrent={0}
      onChange={(item) => handleCategory(item)}
      name="Category"
      cls="category"
      placeholder="Select Category"
    />
  );
};

export default JobCategorySelect;

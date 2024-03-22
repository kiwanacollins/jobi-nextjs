'use client';
import React, { useEffect, useState } from 'react';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import JobCategorySelect from '../select/job-category';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/utils/utils';

interface SearchFormProps {
  route?: string;
}

const SearchForm = ({ route }: SearchFormProps) => {
  const { handleSubmit } = useSearchFormSubmit();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [keyword, setKeyword] = useState<string>(query || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: keyword
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['query']
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, pathname, router, searchParams, query, route]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-5">
          <div className="input-box">
            <div className="label">What are you looking for?</div>
            <input
              type="text"
              placeholder="name, keyword or skills..."
              className="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="input-box border-left">
            <div className="label">Category</div>
            <JobCategorySelect />
          </div>
        </div>
        <div className="col-md-3">
          <button className="fw-500 text-uppercase h-100 tran3s search-btn">
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;

'use client';
import React, { useEffect, useState } from 'react';
// import FilterCompanyLocation from './filter-company-location';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/utils/utils';

const CompanyV1Filter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('keyword');
  const [keyword, setKeyword] = useState<string>(query || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'keyword',
          value: keyword
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['keyword']
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, pathname, router, searchParams, query]);
  return (
    <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">
      <div className="filter-block bottom-line pb-25">
        <a
          className="filter-title fw-500 text-dark"
          data-bs-toggle="collapse"
          href="#collapseSemploye"
          role="button"
          aria-expanded="false"
        >
          Search Company
        </a>
        <div className="collapse show" id="collapseSemploye">
          <div className="main-body">
            <form action="#" className="input-box position-relative">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                placeholder="Company Name"
              />
              <button>
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* <div className="filter-block bottom-line pb-25 mt-25">
        <a
          className="filter-title fw-500 text-dark"
          data-bs-toggle="collapse"
          href="#collapseCstatus"
          role="button"
          aria-expanded="false"
        >
          Company Status
        </a>
        <div className="collapse show" id="collapseCstatus">
          <div className="main-body">
            <ul className="style-none filter-input">
              <li>
                <input type="checkbox" name="CompanyStatus" />
                <label>New</label>
              </li>
              <li>
                <input type="checkbox" name="CompanyStatus" />
                <label>Top Rated</label>
              </li>
              <li>
                <input type="checkbox" name="CompanyStatus" />
                <label>Older</label>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="filter-block bottom-line pb-25 mt-25">
        <a
          className="filter-title fw-500 text-dark"
          data-bs-toggle="collapse"
          href="#collapseLocation"
          role="button"
          aria-expanded="false"
        >
          Location
        </a>
        <div className="collapse show" id="collapseLocation">
          <div className="main-body">
            <FilterCompanyLocation />
          </div>
        </div>
      </div>

      <div className="filter-block bottom-line pb-25 mt-25">
        <a
          className="filter-title fw-500 text-dark collapsed"
          data-bs-toggle="collapse"
          href="#collapseTeam"
          role="button"
          aria-expanded="false"
        >
          Team Size
        </a>
        <div className="collapse show" id="collapseTeam">
          <div className="main-body">
            <ul className="style-none filter-input">
              <li>
                <input type="checkbox" name="Team" />
                <label>12+ Team Size</label>
              </li>
              <li>
                <input type="checkbox" name="Team" />
                <label>7+ Team Size</label>
              </li>
              <li>
                <input type="checkbox" name="Team" />
                <label>10+ Team Size</label>
              </li>
              <li>
                <input type="checkbox" name="Team" />
                <label>15+ Team Size</label>
              </li>
              <li>
                <input type="checkbox" name="Team" />
                <label>5+ Team Size</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <a
        href="#"
        className="btn-ten fw-500 text-white w-100 text-center tran3s mt-30"
      >
        Apply Filter
      </a> */}
    </div>
  );
};

export default CompanyV1Filter;

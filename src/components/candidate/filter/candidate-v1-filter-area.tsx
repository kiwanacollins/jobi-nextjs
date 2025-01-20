'use client';
import React, { useEffect, useState } from 'react';
import FilterSkills from './filter-skills';
// import FilterCandidateLocation from './filter-location';
import FilterCandidateExperience from './filter-experince';
// import JobPrices from '../../jobs/filter/job-prices';
import FilterEnglishFluency from './filter-english-fluency';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/utils/utils';
import SelectCandidateQualification from './select-qualification';
import SelectCandidateType from './select-gender';

interface IProps {
  subcategories?: any;
}

const CandidateV1FilterArea = ({ subcategories }: IProps) => {
  // const [priceValue, setPriceValue] = useState<number[]>([0, 5000]);
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
        if (pathname === '/candidates') {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['keyword']
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, pathname, router, searchParams, query]);

  return (
    <div
      className="filter-area-tab offcanvas offcanvas-start"
      id="filteroffcanvas"
    >
      <button
        type="button"
        className="btn-close text-reset d-lg-none"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
      <div className="main-title fw-500 text-dark">Filter By</div>
      <div className="light-bg border-20 ps-4 pe-4 pt-25 pb-30 mt-20">
        <div className="filter-block bottom-line pb-25">
          <a
            className="filter-title text-decoration-none  fw-500 text-dark"
            data-bs-toggle="collapse"
            href="#collapseSemploye"
            role="button"
            aria-expanded="false"
          >
            Name or Keyword
          </a>
          <div className="collapse show" id="collapseSemploye">
            <div className="main-body">
              <form action="#" className="input-box position-relative">
                <input
                  type="text"
                  placeholder="Name or keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button>
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="filter-block bottom-line pb-25 mt-25">
          <a
            className="filter-title text-decoration-none  fw-500 text-dark"
            data-bs-toggle="collapse"
            href="#collapseCategory"
            role="button"
            aria-expanded="false"
          >
            Skill
          </a>
          <div className="collapse show" id="collapseCategory">
            <div className="main-body">
              <FilterSkills subcategories={subcategories} />
            </div>
          </div>
        </div>

        <div className="filter-block bottom-line pb-25 mt-25">
          <a
            className="filter-title text-decoration-none  fw-500 text-dark collapsed"
            data-bs-toggle="collapse"
            href="#collapseExp"
            role="button"
            aria-expanded="false"
          >
            Expert Level
          </a>
          <div className="collapse" id="collapseExp">
            <div className="main-body">
              <FilterCandidateExperience />
            </div>
          </div>
        </div>

        <div className="filter-block bottom-line pb-25 mt-25">
          <a
            className="filter-title text-decoration-none  fw-500 text-dark collapsed"
            data-bs-toggle="collapse"
            href="#collapseQualification"
            role="button"
            aria-expanded="false"
          >
            Qualification
          </a>
          <div className="collapse" id="collapseQualification">
            <div className="main-body">
              <SelectCandidateQualification />
            </div>
          </div>
        </div>

        <div className="filter-block bottom-line pb-25 mt-25">
          <a
            className="filter-title text-decoration-none  fw-500 text-dark collapsed"
            data-bs-toggle="collapse"
            href="#collapseCType"
            role="button"
            aria-expanded="false"
          >
            Candidate Type
          </a>
          <div className="collapse" id="collapseCType">
            <div className="main-body">
              <SelectCandidateType />
            </div>
          </div>
        </div>

        <div className="filter-block bottom-line pb-25 mt-25">
          <a
            className="filter-title text-decoration-none  fw-500 text-dark collapsed"
            data-bs-toggle="collapse"
            href="#collapseFluency"
            role="button"
            aria-expanded="false"
          >
            English Fluency
          </a>
          <div className="collapse" id="collapseFluency">
            <div className="main-body">
              <FilterEnglishFluency />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateV1FilterArea;

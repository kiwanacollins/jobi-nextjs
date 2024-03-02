'use client';
import React, { useState } from 'react';
import InputRange from '@/ui/input-range';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';

// prop type
type IProps = {
  priceValue: number[];
  setPriceValue: React.Dispatch<React.SetStateAction<number[]>>;
  maxPrice: number;
};
// Salary Range Slider
export function SalaryRangeSlider({
  priceValue,
  setPriceValue,
  maxPrice
}: IProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const min = searchParams.get('min');
  const max = searchParams.get('max');

  // eslint-disable-next-line no-unused-vars
  const [active, setActive] = useState(min || max || '');
  console.log('active:', active);
  // handleChanges
  const handleChanges = (val: number[]) => {
    setPriceValue(val);

    const newUrl = qs.stringifyUrl(
      {
        url: window?.location?.pathname || '',
        query: {
          min: val[0],
          max: val[1]
        }
      },
      { skipNull: true }
    );
    console.log('newUrl:', newUrl);

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="salary-slider">
      <div className="price-input d-flex align-items-center pt-5">
        <div className="field d-flex align-items-center">
          <input
            type="number"
            className="input-min"
            defaultValue={priceValue[0]}
            readOnly
          />
        </div>
        <div className="pe-1 ps-1">-</div>
        <div className="field d-flex align-items-center">
          <input
            type="number"
            className="input-max"
            defaultValue={priceValue[1]}
            readOnly
          />
        </div>
        <div className="currency ps-1">USD</div>
      </div>
      <div className="range-input mb-10">
        <InputRange
          MAX={maxPrice}
          MIN={0}
          STEP={1}
          values={priceValue}
          handleChanges={handleChanges}
        />
      </div>
    </div>
  );
}

const JobPrices = ({ priceValue, setPriceValue, maxPrice }: IProps) => {
  return (
    <div className="main-body">
      <SalaryRangeSlider
        maxPrice={maxPrice}
        priceValue={priceValue}
        setPriceValue={setPriceValue}
      />
      <ul className="style-none d-flex flex-wrap justify-content-between radio-filter mb-5">
        <li>
          <input type="radio" name="jobDuration" defaultValue="01" />
          <label>Weekly</label>
        </li>
        <li>
          <input type="radio" name="jobDuration" defaultValue="02" />
          <label>Monthly</label>
        </li>
        <li>
          <input type="radio" name="jobDuration" defaultValue="03" />
          <label>Hourly</label>
        </li>
      </ul>
    </div>
  );
};

export default JobPrices;

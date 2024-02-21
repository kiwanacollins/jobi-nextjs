'use client';
import React, { useState } from 'react';
import InputRange from '@/ui/input-range';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery } from '@/utils/utils';

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
  const gte = searchParams.get('gte');
  const lte = searchParams.get('lte');

  // eslint-disable-next-line no-unused-vars
  const [active, setActive] = useState(gte || lte || '');
  console.log('active:', active);
  // handleChanges
  const handleChanges = (val: number[]) => {
    setPriceValue(val);
    const newGtUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'price',
      value: `${val[0]},${val[1]}`
    });

    router.push(newGtUrl, { scroll: false });

    console.log({
      gte: val[0],
      lte: val[1]
    });
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

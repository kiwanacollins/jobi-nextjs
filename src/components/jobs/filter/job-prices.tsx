'use client';
import React, { useState } from 'react';
import InputRange from '@/ui/input-range';
import { useRouter, useSearchParams } from 'next/navigation';


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
  
  // handleChanges
  const handleChanges = (val: number[]) => {
    setPriceValue(val);
    
  };
  
  return (
    <div className="salary-slider">
      <div className="price-input d-flex align-items-center">
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
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const duration = searchParams.get('duration');
  // const [active, setActive] = useState(duration || '');
  const durations = [
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Hourly', label: 'Hourly' },
    { value: 'Yearly', label: 'Yearly' }
  ];
  // const handleDurationChangle = (item: { value: string; label: string }) => {
  //   if (active === item.value) {
  //     setActive('');
  //     const newUrl = formUrlQuery({
  //       params: searchParams.toString(),
  //       key: 'duration',
  //       value: null
  //     });

  //     router.push(newUrl, { scroll: false });
  //   } else {
  //     setActive(item.value);

  //     const newUrl = formUrlQuery({
  //       params: searchParams.toString(),
  //       key: 'duration',
  //       value: item.value.toLowerCase()
  //     });

  //     router.push(newUrl, { scroll: false });
  //   }
  // };
  return (
    <div className="main-body">
      <SalaryRangeSlider
        maxPrice={maxPrice}
        priceValue={priceValue}
        setPriceValue={setPriceValue}
      />
      <ul className="style-none d-flex flex-wrap justify-content-between radio-filter">
        {durations?.map((duration, index) => (
          <li key={index}>
            <input
              type="radio"
              name="jobDuration"
              // onClick={() => handleDurationChangle(duration)}
              // checked={active === duration.value}
            />
            <label>{duration.label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobPrices;

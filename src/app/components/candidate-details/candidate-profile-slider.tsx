'use client';
import React from 'react';
import Image from 'next/image';
import Slider from 'react-slick';

import { Iportfolio } from '@/database/resume.model';

interface CandidateProfileSliderProps {
  portfolios: Iportfolio[] | undefined;
}

const CandidateProfileSlider = ({
  portfolios
}: CandidateProfileSliderProps) => {
  // slider setting
  const slider_setting = {
    dots: true,
    arrows: false,
    centerPadding: '0px',
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <Slider {...slider_setting} className="candidate-portfolio-slider">
      {portfolios?.map((img, i) => (
        <div className="item" key={img?.public_id || i}>
          <button className="w-100 d-blok">
            <Image
              src={img?.imageUrl as string}
              alt={img?.public_id as string}
              className="w-100"
              width={350}
              height={400}
              style={{ width: '100%', height: 'auto' }}
            />
          </button>
        </div>
      ))}
    </Slider>
  );
};

export default CandidateProfileSlider;

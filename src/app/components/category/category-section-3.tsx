'use client';
import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
// import { category_data } from './category-section-2';
import { getCategories } from '@/lib/actions/admin.action';
import { ICategory } from '@/database/category.model';
import bg_1 from '@/assets/images/assets/img_16.jpg';

// slider setting
const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: '0px',
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};

export function TrendingJobs() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const categoryItems = categories?.map((c) => ({
    id: c._id,
    name: c.name,
    title: <>{c.name}</>,
    bg_img: bg_1
  }));
  // const category_items = category_data.filter((c) => c.bg_img);
  const sliderRef = useRef<Slider | null>(null);

  const sliderPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderNext = () => {
    sliderRef.current?.slickNext();
  };

  useEffect(() => {
    const fetchAllCategory = async () => {
      const res = await getCategories();
      setCategories(res);
    };
    fetchAllCategory();
  }, []);

  return (
    <>
      <Slider
        {...slider_setting}
        ref={sliderRef}
        className="card-wrapper category-slider-one row"
      >
        {categoryItems.map((item) => (
          <div key={item.id} className="item">
            <div
              className="card-style-six position-relative"
              style={{ backgroundImage: `url(${item.bg_img?.src})` }}
            >
              <Link
                href={{
                  pathname: '/jobs',
                  query: {
                    category: item.name
                  }
                }}
                className="w-100 text-decoration-none h-100 ps-4 pb-20 d-flex align-items-end"
              >
                <div className="title text-white fw-500 text-lg">
                  {item.title}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </Slider>

      <ul className="slider-arrows slick-arrow-two d-flex justify-content-center style-none sm-mt-20">
        <li onClick={sliderPrev} className="prev_d slick-arrow">
          <i className="bi bi-chevron-left"></i>
        </li>
        <li onClick={sliderNext} className="next_d slick-arrow">
          <i className="bi bi-chevron-right"></i>
        </li>
      </ul>
    </>
  );
}

const CategorySectionThree = () => {
  return (
    <>
      <section className="category-section-three pt-85 pb-140 lg-pb-100">
        <div className="container">
          <div className="position-relative">
            <div className="title-two mb-60 lg-mb-40">
              <h2
                className="fw-600 color-blue wow fadeInUp"
                data-wow-delay="0.3s"
              >
                Trending Services
              </h2>
            </div>
            <TrendingJobs />
          </div>
        </div>
      </section>
    </>
  );
};

export default CategorySectionThree;

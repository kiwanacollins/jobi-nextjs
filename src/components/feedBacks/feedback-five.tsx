'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
// internal

import icon from '@/assets/images/icon/icon_41.svg';
import { ITestimonial } from '@/database/Testimonial';

// slider setting
const slider_setting = {
  dots: false,
  arrows: false,
  centerPadding: '0px',
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000000,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};

const FeedbackFive = ({ reviews }: { reviews: ITestimonial[] }) => {
  const sliderRef = useRef<Slider | null>(null);

  const sliderPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderNext = () => {
    sliderRef.current?.slickNext();
  };
  return (
    <section className="feedback-section-five position-relative mt-180 xl-mt-150 pt-90 md-pt-60 pb-130 xl-pb-100 md-pb-70">
      <div className="container">
        <div className="position-relative">
          <div className="row">
            <div className="col-md-6">
              <div className="title-one mb-55 lg-mb-40">
                <h2
                  className="main-font text-white wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  What’s our clients Think of us?
                </h2>
              </div>
            </div>
          </div>
          <Slider
            ref={sliderRef}
            {...slider_setting}
            className="row feedback-slider-one"
          >
            {reviews?.map((item) => (
              <div key={item._id} className="item m-0">
                <div className="feedback-block-three position-relative">
                  <Image src={icon} alt="icon" className="quote-icon" />
                  <div className="review fw-500">{item.review_text}</div>
                  <ul className="style-none d-flex rating">
                    {Array(item?.review_star)
                      .fill(0)
                      .map((r, i) => (
                        <li key={i}>
                          <a href="#">
                            <i className="bi bi-star-fill"></i>
                          </a>
                        </li>
                      ))}
                  </ul>
                  <blockquote className="mt-50 lg-mt-20 mb-15 lg-mb-10 text-dark">
                    {item?.desc}
                  </blockquote>
                  <div className="block-footer d-flex align-items-center justify-content-between pt-35 lg-pt-10">
                    <div className="d-flex align-items-center">
                      <div className="name fw-500 text-dark">{item?.name},</div>
                      <span className="opacity-50 ps-1">{item?.location}</span>
                    </div>
                    <Image
                      src={item?.image?.url}
                      alt="user"
                      width={50}
                      height={50}
                      className="author-img rounded-circle"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          <ul className="slider-arrows slick-arrow-one color-two d-flex justify-content-center style-none sm-mt-30">
            <li onClick={sliderPrev} className="prev_b slick-arrow text-white">
              <i className="bi bi-arrow-left"></i>
            </li>
            <li onClick={sliderNext} className="next_b slick-arrow text-white">
              <i className="bi bi-arrow-right"></i>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeedbackFive;

'use client';
import React, { useRef, useState, useEffect } from 'react';
// import job_data from '@/data/job-data';
import Slider from 'react-slick';
import JobGridItem from './grid/job-grid-item';
import { IJobData } from '@/database/job.model';
import { getJobPosts } from '@/lib/actions/job.action';

// slider setting
const slider_setting = {
  dots: false,
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
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};
const RelatedJobs = ({ category }: { category: string[] }) => {
  const [allJobData, setAllJobData] = useState<IJobData[]>([]);

  const job_items = allJobData.filter((job) => {
    return category.some((c) => job.category.includes(c));
  });
  const sliderRef = useRef<Slider | null>(null);

  const sliderPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderNext = () => {
    sliderRef.current?.slickNext();
  };

  useEffect(() => {
    const fetchData = async () => {
      const { jobs } = await getJobPosts();
      setAllJobData(jobs);
    };
    fetchData();
  }, []);
  return (
    <section className="related-job-section pt-90 lg-pt-70 pb-120 lg-pb-70">
      <div className="container">
        <div className="position-relative">
          <div className="title-three text-center text-md-start mb-55 lg-mb-40">
            <h2 className="main-font">Related Jobs</h2>
          </div>

          <Slider
            {...slider_setting}
            ref={sliderRef}
            className="related-job-slider"
          >
            {job_items?.map((j) => (
              <div key={j.id} className="item">
                <JobGridItem item={j} />
              </div>
            ))}
          </Slider>

          <ul className="slider-arrows slick-arrow-one color-two d-flex justify-content-center style-none sm-mt-20">
            <li onClick={sliderPrev} className="prev_e slick-arrow">
              <i className="bi bi-arrow-left"></i>
            </li>
            <li onClick={sliderNext} className="next_e slick-arrow">
              <i className="bi bi-arrow-right"></i>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RelatedJobs;

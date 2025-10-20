'use client';
import React from 'react';
import banner_1 from '@/assets/images/assets/aerial-shot-hong-kong-night-min.jpg';
import banner_2 from '@/assets/images/assets/hero-banner-2.jpg';
import CounterOne from '../counter/counter-one';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const HeroBannerSix = () => {
  // react hook form
  const rounter = useRouter();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    rounter.push(`/jobs?query=${data.keyword}`);
  };

  return (
    <div className="hero-banner-six position-relative pt-170 lg-pt-150 pb-60 lg-pb-40">
      <div className="container">
        <div className="position-relative">
          <div className="row">
            <div className="col-xxl-8 col-xl-9 col-lg-8 m-auto text-center">
              <h1 className="wow fadeInUp" data-wow-delay="0.3s">
                Find & Hire Experts for any Job
              </h1>
              <p
                className="text-md text-white mt-25 mb-55 lg-mb-40 wow fadeInUp"
                data-wow-delay="0.4s"
              >
                Unlock your potential with quality job & earn from world leading
                brands.
              </p>
            </div>
          </div>
          <div className="position-relative">
            <div className="row">
              <div className="col-xl-6 col-lg-8 col-md-10 m-auto">
                <div
                  className="job-search-one style-two position-relative mb-100 lg-mb-50 wow fadeInUp"
                  data-wow-delay="0.5s"
                  style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    width: '100%',
                    paddingLeft: '15px',
                    paddingRight: '15px'
                  }}
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="search-container" style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#fff',
                      borderRadius: '50px',
                      padding: '8px',
                      boxShadow: '0px 15px 30px rgba(19, 35, 56, 0.1)',
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease'
                    }}>
                      <div className="input-wrapper" style={{
                        flex: 1,
                        padding: '0 20px'
                      }}>
                        <input
                          type="text"
                          placeholder="Search for jobs or keywords..."
                          className="search-input"
                          {...register('keyword')}
                          required
                          style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '16px',
                            fontWeight: '400',
                            color: '#333',
                            width: '100%',
                            padding: '12px 0',
                            lineHeight: '1.5'
                          }}
                          onFocus={(e) => {
                            e.target.parentElement?.parentElement?.style.setProperty('border-color', '#00bf63');
                            e.target.parentElement?.parentElement?.style.setProperty('box-shadow', '0px 15px 40px rgba(0, 191, 99, 0.15)');
                          }}
                          onBlur={(e) => {
                            e.target.parentElement?.parentElement?.style.setProperty('border-color', 'transparent');
                            e.target.parentElement?.parentElement?.style.setProperty('box-shadow', '0px 15px 30px rgba(19, 35, 56, 0.1)');
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="search-button"
                        style={{
                          background: '#00bf63',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '40px',
                          padding: '12px 30px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          minWidth: '120px'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = '#00a855';
                          (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = '#00bf63';
                          (e.target as HTMLElement).style.transform = 'translateY(0)';
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xl-8 m-auto">
                <div className="row">
                  <CounterOne style_2={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="banner-six-carousel"
        className="carousel slide pointer-event"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner w-100 h-100">
          <div
            className="carousel-item active"
            style={{ backgroundImage: `url(${banner_1.src})` }}
          ></div>
          <div
            className="carousel-item"
            style={{ backgroundImage: `url(${banner_2.src})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HeroBannerSix;

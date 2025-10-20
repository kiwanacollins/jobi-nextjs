import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import screen_1 from '@/assets/images/assets/screen_09.png';
import screen_2 from '@/assets/images/assets/screen_08.png';
import shape from '@/assets/images/shape/shape_25.svg';
import AccordionItem from '../accordion/accordion-item';

const FeatureFive = () => {
  return (
    <section className="text-feature-three position-relative pt-225 xl-pt-200 lg-pt-150 md-pt-100">
    <div className="container">
      <div className="row">
        <div className="col-lg-5 order-lg-last ms-auto">
          <div className="wow fadeInRight">
            <div className="title-two">
              <div className="sub-title">Why choose us?</div>
              <h2 className="fw-600 color-blue">Your Gateway to Better Jobs</h2>
            </div>
            <div className="accordion accordion-style-one color-two mt-40" id="accordionOne">
              <AccordionItem id='one' isShow={true} title='Thousands of Verified Jobs' desc='Access a wide range of job opportunities from trusted employers, updated daily for every skill level.' parent='accordionOne' />
              <AccordionItem id='two' title='Fast & Easy Applications' desc='Apply in minutes with our streamlined process and get noticed by top companies.' parent='accordionOne' />
              <AccordionItem id='three' title='Career Growth Support' desc='Benefit from resources, tips, and support to help you land your dream job and advance your career.' parent='accordionOne' />
            </div>
            {/* <Link href="/candidates-v4" className="btn-five mt-45 lg-mt-20">Learn More</Link> */}
          </div>
        </div>
        <div className="col-lg-6 order-lg-first">
          <div className="img-box position-relative rounded-circle d-flex align-items-center justify-content-center wow fadeInLeft">
            <Image src={screen_1} alt="screen" className="lazy-img"/>
            <Image src={screen_2} alt="screen" className="lazy-img shapes screen_02"/>
            <Image src={shape} alt="shape" className="lazy-img shapes shape_01"/>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default FeatureFive;
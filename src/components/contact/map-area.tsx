import React from 'react';
import Image from 'next/image';
import shape from '@/assets/images/shape/shape_02.svg';

const MapArea = () => {
  return (
    <div className="inner-banner-one position-relative pb-0">
      <div className="map-banner">
        <div className="gmap_canvas h-100 w-100">
          <iframe
            className="gmap_iframe h-100 w-100"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1825.3475840396684!2d90.4049505!3d23.793867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7296c5e18ed%3A0x5547aec4ba349cd3!2sAwal%20Center!5e0!3m2!1sen!2sbd!4v1709743913342!5m2!1sen!2sbd"
            width="600"
            height="450"
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <Image src={shape} alt="shape" className="lazy-img shapes shape_01" />
    </div>
  );
};

export default MapArea;

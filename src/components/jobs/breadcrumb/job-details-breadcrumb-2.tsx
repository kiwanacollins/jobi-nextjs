import React from 'react';
import shape_1 from '@/assets/images/shape/shape_02.svg';
import shape_2 from '@/assets/images/shape/shape_03.svg';
import Image from 'next/image';
import { getTimestamp } from '@/utils/utils';
import Link from 'next/link';

interface IProps {
  title: string;
  company?: string;
  createdAt?: Date;
  website?: URL;
  createdBy?: any;
}

const JobDetailsBreadcrumbTwo = ({
  title,
  company,
  createdAt,
  website,
  createdBy
}: IProps) => {
  return (
    <div className="inner-banner-one position-relative">
      <div className="container">
        <div className="position-relative">
          <div className="row">
            <div className="col-xl-8 m-auto text-center">
              <div className="post-date">
                {getTimestamp(createdAt as Date)} by{' '}
                {createdBy ? (
                  <Link
                    href={`/company/${createdBy}`}
                    className="fw-500 text-white"
                  >
                    {company}
                  </Link>
                ) : (
                  <span className="fw-500 text-white">{company}</span>
                )}
              </div>
              <div className="title-two">
                <h2 className="text-white">{title}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image src={shape_1} alt="shape" className="lazy-img shapes shape_01" />
      <Image src={shape_2} alt="shape" className="lazy-img shapes shape_02" />
    </div>
  );
};

export default JobDetailsBreadcrumbTwo;

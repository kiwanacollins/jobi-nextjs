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
              <ul className="share-buttons d-flex flex-wrap justify-content-center style-none mt-10">
                <li>
                  <a
                    href="#"
                    className="d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-facebook"></i>
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <Link
                    href={'#'}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <i className="bi bi-twitter"></i>
                    <span>Twitter</span>
                  </Link>
                </li>
                <li>
                  {website ? (
                    <Link
                      href={website as URL}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <i className="bi bi-link-45deg"></i>
                      <span>website</span>
                    </Link>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-link-45deg"></i>
                      <span>website</span>
                    </span>
                  )}
                </li>
              </ul>
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

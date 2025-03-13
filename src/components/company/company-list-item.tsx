import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CompanyListItem = ({ item }: { item: any }) => {
  return (
    <div
      className={`company-list-layout ${item.isFav ? 'favourite' : ''} mb-20`}
    >
      <div className="row justify-content-between align-items-center">
        <div className="col-xl-5">
          <div className="d-flex align-items-xl-center">
            <Link
              href={`/company/${item._id}`}
              className="company-logo rounded-circle"
            >
              <Image
                src={item?.picture}
                alt="company image"
                width={80}
                height={80}
                className="lazy-img rounded-circle"
              />
            </Link>
            <div className="company-data">
              <h5 className="m0">
                <Link
                  href={`/company/${item._id}`}
                  className="company-name tran3s"
                >
                  {item?.companyName}
                </Link>
              </h5>
              <p>{item?.country}</p>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-4">
          <div className="btn-group d-flex align-items-center justify-content-md-end lg-mt-20">
            <Link
              href={`/company/${item._id}`}
              className="open-job-btn text-center fw-500 tran3s me-2"
            >
              {item.jobPostCount} open job
            </Link>
            <Link
              href={`/company/${item._id}`}
              className="save-btn text-center rounded-circle tran3s"
              title="Save Job"
            >
              <i className="bi bi-bookmark-dash"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyListItem;

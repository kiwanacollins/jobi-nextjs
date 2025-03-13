import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CompanyGridItem = ({ item }: { item: any }) => {
  return (
    <div
      className={`company-grid-layout ${item.isFav ? 'favourite' : ''} mb-30`}
    >
      <Link
        href={`/company/${item._id}`}
        className="company-logo me-auto ms-auto rounded-circle"
      >
        <Image
          src={item?.picture}
          alt="image"
          width={80}
          height={80}
          className="lazy-img rounded-circle"
        />
      </Link>
      <h5 className="text-center">
        <Link href={`/company/${item._id}`} className="company-name tran3s">
          {item.companyName}
        </Link>
      </h5>
      <p className="text-center mb-auto">{item.country}</p>
      <div className="bottom-line d-flex">
        <Link href={`/company/${item._id}`}>{item.jobPostCount} Vacancy</Link>
        <Link href={`/company/${item._id}`}>
          <i className="bi bi-bookmark-dash"></i> Save
        </Link>
      </div>
    </div>
  );
};

export default CompanyGridItem;

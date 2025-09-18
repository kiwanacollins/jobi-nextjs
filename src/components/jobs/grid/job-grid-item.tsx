'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { IJobType } from '@/types/job-data-type';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { add_to_wishlist } from '@/redux/features/wishlist';
import { IJobData } from '@/database/job.model';

const JobGridItem = ({
  item,
  style_2 = true
}: {
  item: IJobData;
  style_2?: boolean;
}) => {
  const { _id, duration, location, title, company, deadline } = item || {};
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const isActive = wishlist.some((p) => p._id === _id);
  const dispatch = useAppDispatch();
  
  // Safety check: if no _id, don't render the component
  if (!_id) {
    console.warn('JobGridItem: No _id provided for item:', item);
    return null;
  }
  
  // Use slug for SEO-friendly URLs, fallback to _id for backward compatibility
  const jobUrl = item.slug ? `/jobs/${item.slug}` : `/job/${item._id}`;
  
  // handle add wishlist
  const handleAddWishlist = (item: IJobData) => {
    dispatch(add_to_wishlist(item));
  };

  // Format deadline
  const formatDeadline = (deadline: Date) => {
    const date = new Date(deadline);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return `Deadline: ${date.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div
      className={`job-list-two ${style_2 ? 'style-two' : ''} position-relative`}
    >
      <div className="text-center mb-3">
        <Link href={jobUrl} className="logo">
          <Image
            src={
              item?.companyImage ||
              //@ts-ignore
              (item?.createdBy?.picture as string) ||
              '/assets/images/logo/media_22.png'
            }
            alt="company logo"
            height={60}
            width={60}
            style={{ height: 'auto', width: 'auto' }}
            className="lazy-img m-auto rounded"
          />
        </Link>
      </div>
      <a
        onClick={() => handleAddWishlist(item)}
        className={`save-btn text-center rounded-circle tran3s cursor-pointer ${isActive ? 'active' : ''}`}
        title={`${isActive ? 'Remove Job' : 'Save Job'}`}
      >
        <i className="bi bi-bookmark-dash"></i>
      </a>
      <div className="text-center mb-2">
        <span className={`job-duration fw-500 text-success ${duration === 'Part time' ? 'part-time' : ''}`}>
          {duration}
        </span>
      </div>
      <div className="text-center mb-2">
        <Link
          href={jobUrl}
          className="title text-decoration-none fw-600 tran3s d-block"
          style={{ fontSize: '16px', color: '#000' }}
        >
          {title}
        </Link>
      </div>
      <div className="text-center text-muted mb-1">
        {company || 'Next Media'}
      </div>
      <div className="text-center text-muted mb-1">
        {location}
      </div>
      <div className="text-center text-muted mb-1">
        {/* @ts-ignore */}
        {item?.createdBy?.firstName || 'kiwana'}
      </div>
      <div className="text-center text-muted mb-3" style={{ fontSize: '12px' }}>
        {formatDeadline(deadline)}
      </div>
      <div className="text-center">
        <Link
          href={jobUrl}
          className="apply-btn text-decoration-none text-center tran3s"
        >
          VIEW
        </Link>
      </div>
    </div>
  );
};

export default JobGridItem;

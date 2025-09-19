'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { IJobType } from "@/types/job-data-type";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { add_to_wishlist } from '@/redux/features/wishlist';
import { IJobData } from '@/database/job.model';

const ListItem = ({
  item,
  style_2,
  cls = ''
}: {
  item: IJobData;
  style_2?: boolean;
  cls?: string;
}) => {
  const { _id, slug, category, company, companyImage, location, deadline, duration, title, createdBy } =
    item;
  const { wishlist } = useAppSelector((state) => state.wishlist);
  
  // Use slug for SEO-friendly URLs, fallback to _id for backward compatibility
  const jobUrl = slug ? `/jobs/${slug}` : `/job/${_id}`;
  const isActive = wishlist.some((p) => p._id === _id);
  const dispatch = useAppDispatch();
  // handle add wishlist
  const handleAddWishlist = (item: IJobData) => {
    dispatch(add_to_wishlist(item));
  };

  // Format deadline
  const formatDeadline = (date: Date | string | undefined) => {
    if (!date) return 'No deadline specified';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get company image with fallback
  const getCompanyImage = () => {
    if (companyImage) return companyImage;
    if (typeof createdBy === 'object' && (createdBy as any)?.picture) return (createdBy as any).picture;
    return '/assets/images/logo/media_22.png'; // Default fallback image
  };

  return (
    <div
      className={`job-list-one position-relative ${cls} ${style_2 ? 'border-style mb-20' : 'bottom-border'}`}
    >
      <div className="row justify-content-between align-items-center">
        <div className="col-auto">
          <div className="company-logo">
            <Link href={jobUrl} className="logo">
              <Image
                src={getCompanyImage()}
                alt={company || 'Company Logo'}
                width={60}
                height={60}
                className="rounded-circle object-fit-cover"
                style={{ objectFit: 'cover' }}
              />
            </Link>
          </div>
        </div>
        <div className="col">
          <div className="job-info ps-3">
            <Link
              href={jobUrl}
              className="title text-decoration-none fw-600 mb-2 d-block"
            >
              {title}
            </Link>
            <div className="company-name text-muted mb-2">
              {company || (typeof createdBy === 'object' && (createdBy as any)?.name) || 'Company'}
            </div>
            <div className="job-meta d-flex flex-wrap align-items-center gap-3">
              <span className="job-location">
                <i className="bi bi-geo-alt me-1"></i>
                {location || 'Remote'}
              </span>
              <span className={`job-duration ${duration === 'Part time' ? 'part-time' : ''}`}>
                <i className="bi bi-clock me-1"></i>
                {duration}
              </span>
              <span className="job-category">
                <i className="bi bi-tag me-1"></i>
                {category}
              </span>
              <span className="job-deadline text-warning">
                <i className="bi bi-calendar me-1"></i>
                Deadline: {formatDeadline(deadline)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-auto">
          <div className="btn-group d-flex align-items-center justify-content-end">
            <a
              onClick={() => handleAddWishlist(item)}
              className={`save-btn text-center rounded-circle tran3s me-3 cursor-pointer ${isActive ? 'active' : ''}`}
              title={`${isActive ? 'Remove Job' : 'Save Job'}`}
            >
              <i className="bi bi-bookmark-dash"></i>
            </a>
            <Link
              href={jobUrl}
              className="apply-btn text-decoration-none text-center tran3s"
            >
              VIEW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;

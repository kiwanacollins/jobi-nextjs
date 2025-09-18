/* eslint-disable camelcase */
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { IJobType } from '@/types/job-data-type';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { add_to_wishlist } from '@/redux/features/wishlist';
import { IJobData } from '@/database/job.model';
import { IUser } from '@/database/user.model';

const ListItemTwo = ({ item,currentUser }: { item: IJobData,  currentUser?: IUser | null; }) => {
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const isActive = wishlist.some((p) => p._id === item._id); // edited
  const dispatch = useAppDispatch();

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
    <div className="job-list-one style-two position-relative border-style mb-20">
      <div className="row justify-content-between align-items-center">
        <div className="col-md-2">
          <div className="company-logo">
            <Link href={jobUrl} className="logo">
              <Image
                src={
                  item?.companyImage ||
                  //@ts-ignore
                  (item?.createdBy?.picture as string) ||
                  '/assets/images/logo/media_22.png'
                }
                alt="company logo"
                width={60}
                height={60}
                style={{ width: 'auto', height: 'auto', maxWidth: '60px', maxHeight: '60px' }}
                className="lazy-img m-auto rounded"
              />
            </Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="job-details">
            <div className="job-duration text-decoration-none fw-500 text-success mb-1">
              {item?.duration}
            </div>
            <Link
              href={jobUrl}
              className="job-title text-decoration-none fw-600 tran3s d-block mb-1"
              style={{ fontSize: '18px', color: '#000' }}
            >
              {item.title}
            </Link>
            <div className="company-name text-muted mb-1">
              {item.company || 'Next Media'}
            </div>
            <div className="job-location text-muted mb-1">
              {item.location}
            </div>
            <div className="job-author text-muted mb-1">
              {/* @ts-ignore */}
              {item?.createdBy?.firstName || 'kiwana'}
            </div>
            <div className="job-deadline text-muted">
              {formatDeadline(item.deadline)}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="btn-group d-flex align-items-center justify-content-end">
           {currentUser?.role !== 'employee'?( <a
              onClick={() => handleAddWishlist(item)}
              className={`save-btn text-center rounded-circle tran3s me-3 cursor-pointer ${
                isActive ? 'active' : ''
              }`}
              title={`${isActive ? 'Remove Job' : 'Save Job'}`}
            >
              <i className="bi bi-bookmark-dash"></i>
            </a>):null}
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

export default ListItemTwo;

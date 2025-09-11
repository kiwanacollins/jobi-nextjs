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
  return (
    <div className="job-list-one style-two position-relative border-style mb-20">
      <div className="row justify-content-between align-items-center">
        <div className="col-md-5">
          <div className="job-title d-flex align-items-center">
            <Link href={jobUrl} className="logo">
              <Image
                src={
                  //@ts-ignore
                  (item?.createdBy?.picture as string) ||
                  '/assets/images/logo/media_22.png'
                }
                alt="logo"
                width={60}
                height={60}
                className="lazy-img m-auto"
              />
            </Link>
            <div className="split-box1">
              <Link
                href={jobUrl}
                className="job-duration text-decoration-none fw-500"
              >
                {item?.duration}
              </Link>
              <Link
                href={jobUrl}
                className="title text-decoration-none fw-500 tran3s"
              >
                {item.title.slice(0, 22)} {item.title.length > 20 ? '..' : ''}
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-sm-6">
          <div className="job-location">
            <Link className="text-decoration-none" href={jobUrl}>
              {item.location}
            </Link>
          </div>
          <div className="job-salary">
            <span className="fw-500 text-dark">
              ${item.minSalary} - ${item.maxSalary}
            </span>{' '}
            / {item.salary_duration} . {item.experience}
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="btn-group d-flex align-items-center justify-content-sm-end xs-mt-20">
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

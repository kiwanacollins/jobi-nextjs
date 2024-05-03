'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { IJobType } from "@/types/job-data-type";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { add_to_wishlist } from '@/redux/features/wishlist';
import { IJobData } from '@/database/job.model';
import { getTime } from '@/utils/utils';

const ListItem = ({
  item,
  style_2,
  cls = ''
}: {
  item: IJobData;
  style_2?: boolean;
  cls?: string;
}) => {
  const { _id, category, industry, duration, location, title, createdBy } =
    item;
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const isActive = wishlist.some((p) => p._id === _id);
  const dispatch = useAppDispatch();
  // handle add wishlist
  const handleAddWishlist = (item: IJobData) => {
    dispatch(add_to_wishlist(item));
  };
  return (
    <div
      className={`job-list-one position-relative ${cls} ${style_2 ? 'border-style mb-20' : 'bottom-border'}`}
    >
      <div className="row justify-content-between align-items-center">
        <div className="col-xxl-3 col-lg-4">
          <div className="job-title d-flex align-items-center">
            <Link href={`/job/${_id}`} className="logo">
              <Image
                src={
                  //@ts-ignore
                  (createdBy?.picture as string) ||
                  '/assets/images/logo/media_22.png'
                }
                alt="logo"
                width={50}
                height={50}
                className="lazy-img m-auto"
              />
            </Link>
            <Link
              href={`/job/${_id}`}
              className="title text-decoration-none fw-500 tran3s"
            >
              {title}
            </Link>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-6 ms-auto">
          <Link
            href={`/job/${_id}`}
            className={`job-duration text-decoration-none fw-500 ${duration === 'Part time' ? 'part-time' : ''}`}
          >
            {duration}
          </Link>
          <div className="job-date">
            {getTime(item?.createAt as Date)} by{' '}
            <Link className="text-decoration-none" href={`/job/${_id}`}>
              {industry}
            </Link>
          </div>
        </div>
        <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6 ms-auto xs-mt-10">
          <div className="job-location">
            <Link className="text-decoration-none" href={`/job/${_id}`}>
              {location}
            </Link>
          </div>
          <div className="job-category">
            {/* {category?.map((c, i) => (
              <a key={i} href="#">
                {c}
                {i < category.length - 1 && ', '}
              </a>
            ))} */}
            {category}
          </div>
        </div>
        <div className="col-lg-2 col-md-4">
          <div className="btn-group d-flex align-items-center justify-content-md-end sm-mt-20">
            <a
              onClick={() => handleAddWishlist(item)}
              className={`save-btn text-center rounded-circle tran3s me-3 cursor-pointer ${isActive ? 'active' : ''}`}
              title={`${isActive ? 'Remove Job' : 'Save Job'}`}
            >
              <i className="bi bi-bookmark-dash"></i>
            </a>
            <Link
              href={`/job/${_id}`}
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

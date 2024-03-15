'use client';
import React from 'react';
// import { ICandidate } from "@/data/candidate-data";
import Image from 'next/image';
import { IUser } from '@/database/user.model';
import Link from 'next/link';
import ActionDropdown from '../candidate/action-dropdown';
import 'bootstrap/dist/js/bootstrap';

const CandidateItem = ({ item }: { item: IUser }) => {
  return (
    <div className="candidate-profile-card list-layout border-0 mb-25">
      <div className="d-flex">
        <div className="cadidate-avatar  position-relative d-block me-auto ms-auto">
          <a href="#" className="rounded-circle">
            <Image
              src={item?.picture as string}
              alt="image"
              className="lazy-img rounded-circle"
              width={70}
              height={70}
            />
          </a>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className=" col-lg-6">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <Link
                    href={`/candidate-profile/${item?._id}`}
                    className="tran3s text-decoration-none  "
                  >
                    {item?.name}
                  </Link>
                </h4>
                <div className="candidate-post">{item?.post}</div>
                <ul className="cadidate-skills style-none d-flex align-items-center">
                  {item?.skills?.map((skill, index) => {
                    return <li key={index}>{skill}</li>;
                  })}
                </ul>
              </div>
            </div>

            <div className=" col-lg-6 col-md-4">
              <div className="d-flex justify-content-md-end align-items-center">
                <Link
                  href={`/candidate-profile/${item?.resumeId}`}
                  className="save-btn text-center rounded-circle tran3s mt-10 fw-normal"
                >
                  <i className="bi bi-eye"></i>
                </Link>
                <div className="action-dots float-end mt-10 ms-2">
                  <button
                    className="action-btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span></span>
                  </button>
                  <ActionDropdown
                    id={item?._id}
                    resumeId={item?.resumeId as string | undefined}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateItem;

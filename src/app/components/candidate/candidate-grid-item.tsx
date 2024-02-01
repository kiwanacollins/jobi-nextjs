import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { ICandidate } from '@/data/candidate-data';
// import { IResumeType } from '@/database/resume.model';

const CandidateGridItem = ({
  item,
  style_2 = false
}: {
  item: any;
  style_2?: boolean;
}) => {
  return (
    <div
      className={`candidate-profile-card ${
        item?.favorite ? 'favourite' : ''
      } text-center ${style_2 ? 'border-0' : ''} grid-layout mb-25`}
    >
      <Link href="/candidate-profile" className="save-btn tran3s">
        <i className="bi bi-heart"></i>
      </Link>
      <div className="cadidate-avatar online position-relative d-block m-auto">
        <Link href="/candidate-profile" className="rounded-circle">
          <Image
            src={item?.user?.picture}
            width={style_2 ? 120 : 80}
            height={style_2 ? 120 : 80}
            alt="image"
            className="lazy-img rounded-circle"
          />
        </Link>
      </div>
      <h4 className="candidate-name mt-15 mb-0">
        <Link href="/candidate-profile" className="tran3s">
          {item.user?.name}
        </Link>
      </h4>
      <div className="candidate-post">{item?.post}</div>
      <ul className="cadidate-skills style-none d-flex flex-wrap align-items-center justify-content-center justify-content-md-between pt-30 sm-pt-20 pb-10">
        {item.skills.slice(0, 3).map((s: any, i: any) => (
          <li key={i}>{s}</li>
        ))}
        {item.skills.length > 3 && (
          <li className="more">
            {item.skills.length - item.skills.slice(0, 3).length}+
          </li>
        )}
      </ul>
      <div className="row gx-1">
        <div className="col-md-6">
          <div className="candidate-info mt-10">
            <span>Salary</span>
            <div>
              {`$${item.minSalary}-${item.maxSalary} `}/
              {item?.salary_duration ?? 'month'}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="candidate-info mt-10">
            <span>Location</span>
            <div>{item.user?.country}</div>
          </div>
        </div>
      </div>
      <div className="row gx-2 pt-25 sm-pt-10">
        <div className="col-md-6">
          <Link
            href="/candidate-profile"
            className="profile-btn tran3s w-100 mt-5"
          >
            View Profile
          </Link>
        </div>
        <div className="col-md-6">
          <Link href="/candidate-profile" className="msg-btn tran3s w-100 mt-5">
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateGridItem;

import React from 'react';
// import { ICandidate } from '@/data/candidate-data';
import Image from 'next/image';
import Link from 'next/link';

const CandidateListItem = ({
  item,
  style_2 = false
}: {
  item: any;
  style_2?: boolean;
}) => {
  return (
    <div
      className={`candidate-profile-card ${item.favorite ? 'favourite' : ''} ${
        style_2 ? 'border-0' : ''
      } list-layout mb-25`}
    >
      <div className="d-flex">
        <div className="cadidate-avatar online position-relative d-block me-auto ms-auto">
          <Link
            href={`/candidate-profile/${item?.resumeId}`}
            className="rounded-circle"
          >
            <Image
              src={item?.picture}
              width={style_2 ? 120 : 80}
              height={style_2 ? 120 : 80}
              alt="image"
              className="lazy-img rounded-circle"
            />
          </Link>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className="col-xl-3">
              <div className="position-relative">
                <h4 className="candidate-name mb-0">
                  <Link
                    href={`/candidate-profile/${item?.resumeId}`}
                    className="tran3s"
                  >
                    {item?.name}
                  </Link>
                </h4>
                <div className="candidate-post">{item.post}</div>
                <ul className="cadidate-skills style-none d-flex align-items-center">
                  {item?.skills
                    ?.slice(0, 3)
                    .map((s: any, i: any) => <li key={i}>{s}</li>)}
                  {item?.skills?.length > 3 && (
                    <li className="more">
                      {item.skills.length - item.skills.slice(0, 3).length}+
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Salary</span>
                <div>
                  {`$${item?.minSalary}-${item?.maxSalary} `}/
                  {item?.salary_duration ?? 'month'}
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4 col-sm-6">
              <div className="candidate-info">
                <span>Location</span>
                <div>{item?.address}</div>
              </div>
            </div>
            <div className="col-xl-3 col-md-4">
              <div className="d-flex justify-content-lg-end">
                <Link
                  href="/candidate-profile"
                  className="save-btn text-center rounded-circle tran3s mt-10"
                >
                  <i className="bi bi-heart"></i>
                </Link>
                <Link
                  href={`/candidate-profile/${item?.resumeId}`}
                  className="profile-btn tran3s ms-md-2 mt-10 sm-mt-20"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateListItem;

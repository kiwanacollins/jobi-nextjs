'use client';
import React from 'react';
// import { ICandidate } from '@/data/candidate-data';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toggleSaveCandidate } from '@/lib/actions/employee.action';
import { notifyError, notifySuccess } from '@/utils/toast';
import { IUser } from '@/database/user.model';

const CandidateListItem = ({
  item,
  style_2 = false,
  loggedInUser
}: {
  item: any;
  style_2?: boolean;
  loggedInUser?: IUser;
}) => {
  const pathname = usePathname();
  const handleSaveCandidate = async (candidateId: string) => {
    const response = await toggleSaveCandidate({
      userId: loggedInUser?._id as string,
      candidateId,
      path: pathname
    });
    if (response.status === 'added') {
      notifySuccess(response.message);
    }
    if (response.status === 'removed') {
      notifyError(response.message);
    }
  };

  const isSaved = loggedInUser?.saved?.includes(item._id);

  return (
    <div
      className={`candidate-profile-card ${item.favorite ? 'favourite' : ''} ${
        style_2 ? 'border-0' : ''
      } list-layout mb-25`}
    >
      <div className="d-flex">
        <div className="cadidate-avatar  position-relative d-block me-auto ms-auto">
          <a href="#" className="rounded-circle">
            <Image
              src={item?.picture}
              width={style_2 ? 120 : 80}
              height={style_2 ? 120 : 80}
              alt="image"
              className="lazy-img rounded-circle"
            />
          </a>
        </div>
        <div className="right-side">
          <div className="row gx-1 align-items-center">
            <div className="col-lg-6">
              <div className="position-relative">
                <h4 className="candidate-name text-decoration-none  tran3s mb-0">
                  <Link
                    href={`/candidate-profile/${item?.resumeId}`}
                    className="tran3s text-decoration-none"
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

            <div className="col-lg-6">
              <div className="d-flex justify-content-lg-end">
                {loggedInUser?.role === 'employee' && (
                  <button
                    onClick={() => handleSaveCandidate(item._id)}
                    className={`save-btn text-center rounded-circle ${isSaved ? 'active' : ''}  tran3s mt-10 }`}
                  >
                    <i className="bi bi-heart "></i>
                  </button>
                )}
                <Link
                  href={`/candidate-profile/${item?.resumeId}`}
                  className="profile-btn tran3s text-decoration-none ms-md-2 mt-10 sm-mt-10"
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

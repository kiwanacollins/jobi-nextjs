import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
            src={item?.picture}
            width={style_2 ? 120 : 80}
            height={style_2 ? 120 : 80}
            alt="image"
            className="lazy-img rounded-circle"
          />
        </Link>
      </div>
      <h4 className="candidate-name mt-15 p-3 mb-0">
        <Link
          href={`/candidate-profile/${item.resumeId}`}
          className="tran3s text-decoration-none "
        >
          {item?.name}
        </Link>
      </h4>
      <div className="candidate-post">{item?.post}</div>
      <ul className="cadidate-skills style-none d-flex flex-wrap align-items-center justify-content-center justify-content-md-between pt-4 sm-pt-20">
        {item.skills.slice(0, 3).map((s: any, i: any) => (
          <li key={i}>{s}</li>
        ))}
        {item.skills.length > 3 && (
          <li className="more">
            {item.skills.length - item.skills.slice(0, 3).length}+
          </li>
        )}
      </ul>

      <div className="row ">
        <div className="col-12">
          <Link
            href={`/candidate-profile/${item?.resumeId}`}
            className="profile-btn text-decoration-none tran3s w-100 mt-5"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateGridItem;

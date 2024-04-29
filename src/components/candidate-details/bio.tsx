import { IUser } from '@/database/user.model';
import Link from 'next/link';
import React from 'react';

const CandidateBio = ({ user }: { user: IUser }) => {
  return (
    <ul className="style-none">
      <li>
        <span>Location: </span>
        <div>{user?.address}</div>
      </li>
      <li>
        <span>Age: </span>
        <div>{user?.age}</div>
      </li>
      <li>
        <span>Email: </span>
        <div>
          <p>{user?.email}</p>
        </div>
      </li>
      <li>
        <span>Qualification: </span>
        <div>{user?.qualification}</div>
      </li>
      <li>
        <span>Gender: </span>
        <div>{user?.gender}</div>
      </li>

      <li>
        <span>Social:</span>
        <div>
          <Link href="#" className="me-3">
            <i className="bi bi-facebook"></i>
          </Link>
          <a href="#" className="me-3">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" className="me-3">
            <i className="bi bi-twitter"></i>
          </a>
          <Link href={`${user?.mediaLinks?.linkedin}`}>
            <i className="bi bi-linkedin"></i>
          </Link>
        </div>
      </li>
    </ul>
  );
};

export default CandidateBio;

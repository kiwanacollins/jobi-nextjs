import { IUser } from '@/database/user.model';
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
          <a href="mailto:me@support.com">{user?.email}</a>
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
        <span>Expected Salary: </span>
        <div>{`$${user.minSalary}k-${user.maxSalary}k/${user.salary_duration}`}</div>
      </li>
      <li>
        <span>Social:</span>
        <div>
          <a href="#" className="me-3">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="me-3">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" className="me-3">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="#">
            <i className="bi bi-linkedin"></i>
          </a>
        </div>
      </li>
    </ul>
  );
};

export default CandidateBio;

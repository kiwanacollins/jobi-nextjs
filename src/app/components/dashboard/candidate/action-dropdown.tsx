import React from 'react';
import Image from 'next/image';
import view from '@/assets/dashboard/images/icon/icon_18.svg';
import share from '@/assets/dashboard/images/icon/icon_19.svg';
import edit from '@/assets/dashboard/images/icon/icon_20.svg';
import delete_icon from '@/assets/dashboard/images/icon/icon_21.svg';
import Link from 'next/link';

interface IProps {
  id: string;
}

const ActionDropdown = ({ id }: IProps) => {
  return (
    <ul className="dropdown-menu dropdown-menu-end">
      <li>
        <a className="dropdown-item" href="#">
          <Image src={view} alt="icon" className="lazy-img" /> View
        </a>
      </li>
      <li>
        <a className="dropdown-item" href="#">
          <Image src={share} alt="icon" className="lazy-img" /> Share
        </a>
      </li>
      <li>
        <Link
          className="dropdown-item"
          href={`/dashboard/admin-dashboard/candidate/edit/${id}`}
        >
          <Image src={edit} alt="icon" className="lazy-img" /> Edit
        </Link>
      </li>
      <li>
        <a className="dropdown-item" href="#">
          <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
        </a>
      </li>
    </ul>
  );
};

export default ActionDropdown;

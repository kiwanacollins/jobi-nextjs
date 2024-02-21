'use client';
import React from 'react';
import Image from 'next/image';
import view from '@/assets/dashboard/images/icon/icon_18.svg';
import share from '@/assets/dashboard/images/icon/icon_19.svg';
import edit from '@/assets/dashboard/images/icon/icon_20.svg';
import delete_icon from '@/assets/dashboard/images/icon/icon_21.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { deleteUserById } from '@/lib/actions/user.action';

interface IProps {
  id: string;
  resumeId?: string | undefined;
}

const ActionDropdown = ({ id, resumeId }: IProps) => {
  const pathname = usePathname();

  const handleDeleteUser = async (userId: string) => {
    await deleteUserById({
      id: userId,
      path: pathname
    });
  };
  return (
    <ul className="dropdown-menu dropdown-menu-end">
      <li>
        <Link href={`/candidate-profile/${resumeId}`} className="dropdown-item">
          <Image src={view} alt="icon" className="lazy-img" /> View
        </Link>
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
        <button onClick={() => handleDeleteUser(id)} className="dropdown-item">
          <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
        </button>
      </li>
    </ul>
  );
};

export default ActionDropdown;

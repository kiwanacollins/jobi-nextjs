'use client';
import React from 'react';
import Image from 'next/image';
import view from '@/assets/dashboard/images/icon/icon_18.svg';
import share from '@/assets/dashboard/images/icon/icon_19.svg';
import edit from '@/assets/dashboard/images/icon/icon_20.svg';
import delete_icon from '@/assets/dashboard/images/icon/icon_21.svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Swal from 'sweetalert2';
import { deleteEmployeeJobPost } from '@/lib/actions/employee.action';

interface IProps {
  jobId: string | undefined;
  createdBy: string | undefined;
}

const JobActionDropdown = ({ jobId, createdBy }: IProps) => {
  const pathname = usePathname();

  const handleDeleteUser = async (jobId: string | undefined) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        //Todo: delete job post by Id
        const res = await deleteEmployeeJobPost({
          jobId,
          path: pathname
        });
        if (res.status === 'ok') {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success'
          });
        }
      }
    });
  };
  return (
    <ul className="dropdown-menu dropdown-menu-end">
      <li className="dropdown-item">
        <Link href={`/candidate-profile/${jobId}`} className="dropdown-item">
          <Image src={view} alt="icon" className="lazy-img" /> View
        </Link>
      </li>
      <li className="dropdown-item">
        <Link href={`/company/${createdBy}`} className="dropdown-item">
          <Image src={view} alt="icon" className="lazy-img" /> company details
        </Link>
      </li>
      <li className="dropdown-item">
        <a className="dropdown-item" href="#">
          <Image src={share} alt="icon" className="lazy-img" /> Share
        </a>
      </li>
      <li className="dropdown-item">
        <Link
          className="dropdown-item"
          href={`/dashboard/employ-dashboard/job/edit/${jobId}`}
        >
          <Image src={edit} alt="icon" className="lazy-img" /> Edit
        </Link>
      </li>
      <li className="dropdown-item">
        <button
          onClick={() => handleDeleteUser(jobId)}
          className="dropdown-item"
        >
          <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
        </button>
      </li>
    </ul>
  );
};

export default JobActionDropdown;

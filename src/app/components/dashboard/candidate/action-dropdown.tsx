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
import Swal from 'sweetalert2';
import { BookCheck } from 'lucide-react';
import { cancelCandidateHiring, markAsHired } from '@/lib/actions/admin.action';

interface IProps {
  id: string;
  resumeId?: string | undefined;
  isHired?: boolean;
}

const ActionDropdown = ({ id, resumeId, isHired }: IProps) => {
  const pathname = usePathname();

  const handleDeleteUser = async (userId: string) => {
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
        const res = await deleteUserById({
          id: userId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success'
          });
        }
        if (res?.error) {
          Swal.fire({ title: 'Error!', text: res.message, icon: 'error' });
        }
      }
    });
  };

  const handleMarkAsHired = async (userId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to mark this user as hired?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, mark as hired!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await markAsHired({
          userId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Hired!',
            text: res.message,
            icon: 'success'
          });
        }
        if (res?.error) {
          Swal.fire('Error!', res.message, 'error');
        }
      }
    });
  };

  // cancel Hiring
  const handleCancelHiring = async (userId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to cancel hiring this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel hiring!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await cancelCandidateHiring({
          userId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Cancelled!',
            text: res.message,
            icon: 'success'
          });
        }
        if (res?.error) {
          Swal.fire({ title: 'Error!', text: res.message, icon: 'error' });
        }
      }
    });
  };
  return (
    <ul className="dropdown-menu dropdown-menu-end">
      <li className="dropdown-item">
        <Link href={`/candidate-profile/${resumeId}`} className="dropdown-item">
          <Image src={view} alt="icon" className="lazy-img" /> View profile
        </Link>
      </li>
      <li className="dropdown-item">
        {!resumeId ? (
          <Link
            href={`/dashboard/admin-dashboard/candidate/addresume/${id}`}
            className="dropdown-item"
          >
            <Image src={edit} alt="icon" className="lazy-img" /> Add Resume
          </Link>
        ) : (
          <Link
            href={`/dashboard/admin-dashboard/candidate/addresume/${id}`}
            className="dropdown-item"
          >
            <Image src={edit} alt="icon" className="lazy-img" /> Edit Resume
          </Link>
        )}
      </li>
      {/* mark as hired */}
      <li className="dropdown-item">
        {!isHired && resumeId ? (
          <button
            onClick={() => handleMarkAsHired(id)}
            className="dropdown-item"
          >
            <BookCheck size={16} /> Mark as Hired
          </button>
        ) : (
          resumeId && (
            <button
              onClick={() => handleCancelHiring(id)}
              className="dropdown-item"
            >
              <BookCheck size={16} /> Cancel Hiring
            </button>
          )
        )}
      </li>
      <li className="dropdown-item">
        <a className="dropdown-item" href="#">
          <Image src={share} alt="icon" className="lazy-img" /> Share
        </a>
      </li>
      <li className="dropdown-item">
        <Link
          className="dropdown-item"
          href={`/dashboard/admin-dashboard/candidate/edit/${id}`}
        >
          <Image src={edit} alt="icon" className="lazy-img" /> Edit
        </Link>
      </li>
      <li className="dropdown-item">
        <button onClick={() => handleDeleteUser(id)} className="dropdown-item">
          <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
        </button>
      </li>
    </ul>
  );
};

export default ActionDropdown;

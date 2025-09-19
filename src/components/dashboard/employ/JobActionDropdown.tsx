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
import { IJobData } from '@/database/job.model';

interface IProps {
  job: IJobData;
  jobId: string | undefined;
  createdBy: string | undefined;
}

const JobActionDropdown = ({ job, jobId, createdBy }: IProps) => {
  const pathname = usePathname();

  // Use slug for SEO-friendly URLs, fallback to _id for backward compatibility
  const jobUrl = job.slug ? `/jobs/${job.slug}` : `/job/${job._id}`;
  const editUrl = job.slug ? `/dashboard/employ-dashboard/job/edit/${job.slug}` : `/dashboard/employ-dashboard/job/edit/${job._id}`;

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

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${jobUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        fallbackShare(shareUrl);
      }
    } else {
      fallbackShare(shareUrl);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        title: 'Link Copied!',
        text: 'Job link has been copied to your clipboard',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }).catch(() => {
      Swal.fire({
        title: 'Share Link',
        input: 'text',
        inputValue: url,
        inputAttributes: {
          readonly: 'true'
        },
        showCancelButton: true,
        confirmButtonText: 'Copy',
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          navigator.clipboard.writeText(url);
        }
      });
    });
  };

  return (
    <ul className="dropdown-menu dropdown-menu-end">
      <li className="dropdown-item">
        <Link href={jobUrl} className="dropdown-item">
          <Image src={view} alt="icon" className="lazy-img" /> View
        </Link>
      </li>
      <li className="dropdown-item">
        <button onClick={handleShare} className="dropdown-item">
          <Image src={share} alt="icon" className="lazy-img" /> Share
        </button>
      </li>
      <li className="dropdown-item">
        <Link
          className="dropdown-item"
          href={editUrl}
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

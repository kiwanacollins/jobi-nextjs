'use client';
import edit from '@/assets/dashboard/images/icon/icon_20.svg';
import delete_icon from '@/assets/dashboard/images/icon/icon_21.svg';
import { deleteBlogById } from '@/lib/actions/blog.action';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import Swal from 'sweetalert2';

interface IBlogActionProps {
    blogId: string
}

const BlogActionDropDown = ({blogId}:IBlogActionProps) => {
    const pathname = usePathname();
  const handleDeleteBlog = async (blogId: string) => {
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
        const res = await deleteBlogById({
          blogId,
          path: pathname
        });
        if (res.success) {
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
        <Link
          className="dropdown-item"
          href={`/dashboard/admin-dashboard/blog/${blogId}`}
        >
          <Image src={edit} alt="icon" className="lazy-img" /> Edit
        </Link>
      </li>
      <li className="dropdown-item">
        <button
          onClick={() => handleDeleteBlog(blogId)}
          className="dropdown-item"
        >
          <Image src={delete_icon} alt="icon" className="lazy-img" /> Delete
        </button>
      </li>
    </ul>
  )
}

export default BlogActionDropDown
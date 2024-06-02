import { getTimestamp } from '@/utils/utils';
import Image from 'next/image';
import React from 'react'
import BlogActionDropDown from './BlogActionDropDown';

interface IBlogItemProps {
    serial: number
    blogId: string
    title: string;
    updatedAt: Date;
    image: string;
}

const BlogItem = ({blogId,image,updatedAt,title,serial}:IBlogItemProps) => {
  return (
    <tr>
    <td>
      <div className="job-name fw-500">{serial}</div>
    </td>
    <td>
      <div className="job-name fw-500">
        <Image src={image} alt={title} width={100} height={80} />
      </div>
    </td>
    <td>
      <div className="job-name fw-500">{title}</div>
    </td>
    <td>
      <div className="job-name fw-500">{getTimestamp(updatedAt as Date)}</div>
    </td>


    <td>
      <div className="action-dots float-end">
        <button
          className="action-btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span></span>
        </button>
        <BlogActionDropDown blogId={blogId} />
      </div>
    </td>
  </tr>
  )
}

export default BlogItem
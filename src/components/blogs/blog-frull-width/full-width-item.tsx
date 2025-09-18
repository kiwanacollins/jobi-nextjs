import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IBlog } from '@/database/Blog.model';
import { getTimestamp } from '@/utils/utils';

interface IProps {
  blog: IBlog;
}

const FullWidthItem = ({ blog }: IProps) => {
  // const { id, img_full, date, featured, tags, title } = blog || {};
  return (
    <article className="blog-meta-two box-layout mb-50 lg-mb-30">
      <figure className="post-img m0">
        <Link href={`/blog/${blog.slug || blog._id}`} className="w-100 d-block">
          <Image
            src={blog.image.url}
            alt="blog-img"
            width={370}
            height={270}
            className="lazy-img w-100 tran4s"
          />
        </Link>
        <Link
          href={`/blog/${blog.slug || blog._id}`}
          className="tags text-decoration-none fw-500"
        >
          {blog.tags[0]}
        </Link>
      </figure>
      <div className="post-data mt-35">
        <div className="date">
          {blog.updatedAt && (
            <span className="fw-500 text-decoration-none  text-dark">
              Featured -
            </span>
          )}
          <Link className="text-decoration-none" href={`/blog/${blog.slug || blog._id}`}>
            {getTimestamp(blog.updatedAt as Date)}
          </Link>
        </div>
        <Link
          className="text-decoration-none tran3s"
          href={`/blog/${blog.slug || blog._id}`}
        >
          <h4 className="tran3s  blog-title">
            {`${blog.title.substring(0, 30)}...`}
          </h4>
        </Link>
        <Link
          href={`/blog/${blog.slug || blog._id}`}
          className="continue-btn tran3s d-flex align-items-center"
        >
          <span className="fw-500 text-decoration-none me-2">
            Continue Reading
          </span>
          <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </article>
  );
};

export default FullWidthItem;

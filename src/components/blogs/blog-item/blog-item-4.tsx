import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import icon from '@/assets/images/icon/icon_42.svg';
import { IBlog } from '@/database/Blog.model';
import { getTime } from '@/utils/utils';

const BlogItemFour = ({ blog }: { blog: IBlog }) => {
  return (
    <article className="blog-meta-one  mt-35 xs-mt-20 wow fadeInUp">
      <figure className="post-img m0">
        <Link href={`/blog/${blog.slug || blog._id}`} className="w-100 d-block">
          <Image
            src={blog.image.url}
            alt="blog img"
            className="lazy-img w-100 tran4s"
            width={400}
            height={300}
          />
        </Link>
      </figure>
      <div className="post-data mt-30 lg-mt-20">
        <div>
          <Link
            href={`/blog/${blog.slug || blog._id}`}
            className="date text-decoration-none "
          >
            {getTime(blog.createdAt as Date)}
          </Link>
        </div>
        <Link
          href={`/blog/${blog.slug || blog._id}`}
          className="mt-10 mb-5 text-decoration-none "
        >
          <h4 className="tran3s blog-title">{`${blog.title.substring(0, 50)}...`}</h4>
        </Link>
        {/* <p className="mb-20">{blog.desc}…</p> */}
        <Link href={`/blog/${blog.slug || blog._id}`} className="read-more">
          <Image src={icon} alt="icon" className="lazy-img" />
        </Link>
      </div>
    </article>
  );
};

export default BlogItemFour;

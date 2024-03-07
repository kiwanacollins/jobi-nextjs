import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IBlog } from '@/database/Blog.model';
import { getTimestamp } from '@/utils/utils';

interface IBlogSidebarProps {
  blogs: IBlog[];
}

const BlogSidebar = ({ blogs }: IBlogSidebarProps) => {
  const recent_blogs = blogs.slice(-3);
  return (
    <div className="blog-sidebar ps-xl-4 md-mt-60">
      <form action="#" className="search-form position-relative mb-50 lg-mb-40">
        <input type="text" placeholder="Search..." />
        <button>
          <i className="bi bi-search"></i>
        </button>
      </form>

      <div className="sidebar-recent-news mb-60 lg-mb-40">
        <h4 className="sidebar-title">Other Blogs</h4>
        {recent_blogs?.map((b, i) => (
          <div
            key={i}
            className={`news-block d-flex align-items-center pt-20 pb-20 border-top ${
              i === recent_blogs.length - 1 ? 'border-bottom' : ''
            }`}
          >
            <div>
              <Image
                src={b.image.url}
                width={80}
                height={80}
                alt=""
                className="lazy-img"
              />
            </div>
            <div className="post ps-4">
              <h4 className="">
                <Link
                  href={`/blog/${b._id}`}
                  className="title  text-decoration-none  tran3s"
                >
                  {b.title}
                </Link>
              </h4>
              <div className="date">{getTimestamp(b.updatedAt as Date)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSidebar;

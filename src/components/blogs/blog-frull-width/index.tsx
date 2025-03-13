import React from 'react';
import FullWidthItem from './full-width-item';
import { IBlog } from '@/database/Blog.model';

interface IProps {
  blogs: IBlog[];
}

const BlogFullWidthArea = ({ blogs }: IProps) => {
  // const blog_items = blog_data
  //   .filter((b) => b.blog === 'blog-postbox')
  //   .slice(0, 8);
  return (
    <section className="blog-section bg-color pt-100 lg-pt-80 pb-120 lg-pb-80">
      <div className="container">
        <div className="row gx-xl-5">
          {blogs.map((blog) => (
            <div key={blog._id} className="col-md-6">
              <FullWidthItem blog={blog} />
            </div>
          ))}
        </div>
        {/* <BlogPagination /> */}
      </div>
    </section>
  );
};

export default BlogFullWidthArea;

import React from 'react';
// import blog_data from '@/data/blog-data';
import BlogItemFour from './blog-item/blog-item-4';
import Link from 'next/link';
import { fetchAllBlogs } from '@/lib/actions/blog.action';
import { IBlog } from '@/database/Blog.model';

const BlogFour = async () => {
  // const blog_items = blog_data.filter((b) => b.blog === 'blog-two');
  const blogs = await fetchAllBlogs();
  return (
    <section className="blog-section-one mt-160 xl-mt-150 lg-mt-100">
      <div className="container">
        <div className="position-relative">
          <div className="row">
            <div className="col-xl-7">
              <div className="title-one mb-30 lg-mb-10">
                <h2
                  className="main-font color-blue wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  Jobi Guides
                </h2>
              </div>
            </div>
          </div>

          <div className="row gx-xxl-5">
            {blogs?.slice(0, 3)?.map((item: IBlog) => (
              <div key={item._id} className="col-lg-4 col-md-6">
                <BlogItemFour blog={item} />
              </div>
            ))}
          </div>

          <div className="text-center explore-btn sm-mt-50">
            <Link href="/blogs" className="btn-six">
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFour;

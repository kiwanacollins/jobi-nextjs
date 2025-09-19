import React from 'react';

import BlogSidebar from '@/components/blogs/blog-postbox/sidebar';
import CommonBreadcrumb from '@/components/common/common-breadcrumb';
import BlogArticleDetails from '@/components/blogs/BlogArticleDetails/BlogArticleDetails';
import { fetchAllBlogs, getBlogBySlugOrId } from '@/lib/actions/blog.action';
import { redirect } from 'next/navigation';
import { IBlog } from '@/database/Blog.model';

interface URLProps {
  params: { id: string };
  // searchParams: { [key: string]: string | undefined };
}

const BlogDetailsArea = async ({ params }: URLProps) => {
  const blog = await getBlogBySlugOrId(params.id);
  if (blog?.slug && params.id !== blog.slug) {
    redirect(`/blog/${blog.slug}`);
  }
  const blogs = await fetchAllBlogs();
  // get other blogs
  const otherBlogs = blogs.filter((b: IBlog) => b._id !== blog._id);
  return (
    <>
      <CommonBreadcrumb
        title="Blog"
        subtitle="Read our blog from top talents"
      />
      <section className="blog-section pt-100 lg-pt-80">
        <div className="container">
          <div className="border-bottom pb-160 xl-pb-130 lg-pb-80">
            <div className="row">
              <div className="col-lg-8">
                <div className="blog-details-page pe-xxl-5 me-xxl-3">
                  <BlogArticleDetails item={blog} />
                </div>
              </div>

              <div className="col-lg-4">
                <BlogSidebar blogs={otherBlogs} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetailsArea;

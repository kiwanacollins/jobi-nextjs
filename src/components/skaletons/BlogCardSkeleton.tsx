import React from 'react';
const BlogCardSkeleton = () => (
  <article className="blog-meta-two placeholder-glow  box-layout mb-50 lg-mb-30">
    <figure className="post-img    m0">
      <div
        style={{
          width: '370px',
          height: '370px'
        }}
        className="placeholder bg-success    placeholder-lg w-100"
      ></div>
    </figure>
    <div className="post-data mt-35">
      <div className="date">
        <div className="placeholder bg-success w-50"></div>
      </div>
      <div className="placeholder bg-success w-100 mb-3"></div>
      <div className="placeholder bg-success w-80 mb-3"></div>
      <div className="placeholder bg-success w-60 mb-3"></div>
      <div className="continue-btn tran3s d-flex align-items-center">
        <div className="placeholder bg-success w-50 me-2"></div>
        <div className="placeholder bg-success w-20">
          <div className="text-primary" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      </div>
    </div>
  </article>
);
export default BlogCardSkeleton;

import { IBlog } from '@/database/Blog.model';
import { getTimestamp } from '@/utils/utils';
import Image from 'next/image';

interface BlogCardProps {
  blog: IBlog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <div className="card py-3" style={{ maxWidth: '18rem' }}>
      <Image
        src={blog?.image?.url}
        width={100}
        height={150}
        className="card-img-top"
        alt="Blog Image"
      />
      <div className="card-body">
        <h5 className="card-title">
          {blog.title.length > 30
            ? blog.title.slice(0, 30) + '...'
            : blog.title}
        </h5>
        <p className="text-secondary ">
          {blog.content.length > 70
            ? blog.content.slice(0, 70) + '...'
            : blog.content}
        </p>
        <div className="d-flex flex-column flex-md-row gap-1 py-2">
          <button className="btn btn-primary">Update</button>
          <button className="btn btn-danger">Delete</button>
        </div>
        <div className="card-footer mt-2 px-2">
          <small className="text-muted">
            Last updated {getTimestamp(blog?.updatedAt as Date)}
          </small>
        </div>
      </div>
    </div>
  );
};
export default BlogCard;

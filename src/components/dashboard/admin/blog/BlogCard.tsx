'use client';
import { IBlog } from '@/database/Blog.model';
import { deleteBlogById } from '@/lib/actions/blog.action';
import { getTimestamp } from '@/utils/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Swal from 'sweetalert2';
import parse from 'html-react-parser';

interface BlogCardProps {
  blog: IBlog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
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
        {/* <p className="text-secondary ">
          {parse(blog.content.slice(0, 90) + '...')}
        </p> */}
        <div className="d-flex flex-column flex-md-row gap-1 py-2">
          <Link
            href={`/dashboard/admin-dashboard/blog/${blog._id}`}
            className="btn btn-primary"
          >
            Update
          </Link>
          <button
            onClick={() => handleDeleteBlog(blog._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="card-footer mt-2 px-2">
        <small className="text-muted">
          Last updated {getTimestamp(blog?.updatedAt as Date)}
        </small>
      </div>
    </div>
  );
};
export default BlogCard;

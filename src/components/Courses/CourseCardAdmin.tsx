'use client';
import { deleteCourseById } from '@/lib/actions/Course.action';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Swal from 'sweetalert2';

interface CourseCardProps {
  title: string;
  image: string;
  id?: string;
}

const CourseCardAdmin = ({ title, image, id }: CourseCardProps) => {
  const pathname = usePathname();
  const handleCourseDelete = async (courseId: string) => {
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
        const res = await deleteCourseById({
          courseId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success'
          });
        }
        if (res?.error) {
          Swal.fire({ title: 'Error!', text: res.message, icon: 'error' });
        }
      }
    });
  };
  return (
    <div className={`col-md-6 col-sm-6 col-12 mb-3`}>
      <div className="card cursor-pointer">
        <Image
          src={image}
          width={150}
          height={200}
          className="card-img-top"
          alt="Course Image"
        />
        <div className="card-body">
          <h5 className="card-title fw-bold ">{title}</h5>
          <div className="d-flex gap-3    justify-content-between align-items-center   py-2">
            <div>
              <Link
                href={`/dashboard/admin-dashboard/courses/edit/${id}`}
                className=" btn btn-success text-white"
              >
                Update
              </Link>
            </div>
            <div>
              <Link
                href={`/dashboard/admin-dashboard/courses/outline/${id}`}
                className=" btn btn-primary text-white"
              >
                Modules
              </Link>
            </div>
            <div>
              <button
                onClick={() => handleCourseDelete(id as string)}
                className=" btn btn-danger text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardAdmin;

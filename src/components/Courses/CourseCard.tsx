'use client';
import { IUser } from '@/database/user.model';
import { enrollToCourse } from '@/lib/actions/Course.action';
import { notifyError } from '@/utils/toast';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface CourseCardProps {
  title: string;
  image: string;
  courseId: string;
  user: IUser | null;
  clerkId: string | null;
}

const CourseCard = ({
  title,
  image,
  courseId,
  user,
  clerkId
}: CourseCardProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname();
  const handleEnrllToCourse = async (courseId: string, userId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Confirm to enroll in this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true) 
        const res = await enrollToCourse({
          courseId,
          userId: userId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Enrolled!',
            text: res.message,
            icon: 'success'
          });
          setIsLoading(false) 
        }
        if (res?.error) {
          Swal.fire({ title: 'Error!', text: res.message, icon: 'error' });
          setIsLoading(false) 
        }
      }
    });
  };

  const isEnrolled = user?.course?.includes(courseId as any);

  return (
    <div className={`col-md-4 col-sm-6 col-12 mb-3`}>
      <div className="card">
        <Link href={`/courses/${courseId}`}>
          <Image
            src={image}
            width={150}
            height={200}
            className="card-img-top cursor-pointer"
            alt="Course Image"
          />
        </Link>
        <div className="card-body">
          <Link href={`/courses/${courseId}`}>
            <h5 className="card-title fw-bold ">{title}</h5>
          </Link>
          <div className="d-flex  justify-content-between  align-items-center ">
            <div>
              <p className="fw-bold text-success">Free</p>
            </div>
            {!clerkId ? (
              <button
                onClick={() =>
                  notifyError('Please login to enroll in this course')
                }
                disabled={isLoading}
                className="btn btn-success"
              >
                <span className=" p-0">{isLoading ? 'Enrolling..' : 'Enroll'}</span>
              </button>
            ) : isEnrolled ? (
              <Link href={`/courses/${courseId}`} className="btn btn-success">
                <span className=" p-0">Enrolled</span>
              </Link>
            ) : (
              <button
                onClick={() =>
                  handleEnrllToCourse(courseId, user?.clerkId as string)
                }
                className="btn btn-success"
              >
                <span className=" p-0">Enroll</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

'use client';
import { makeUserAdmin } from '@/lib/actions/admin.action';
import { notifySuccess } from '@/utils/toast';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMsg from '../../common/error-msg';
import { emailSchema } from '@/utils/validation';

const DashboardMakeAdmin = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const pathname = usePathname();
  type IEmailType = z.infer<typeof emailSchema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IEmailType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: IEmailType) => {
    setIsSubmitting(true);
    try {
      await makeUserAdmin({
        email: data.email,
        path: pathname
      });

      notifySuccess('Admin created successfully');
      setIsSubmitting(false);
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };
  return (
    <div>
      <div className="dash-input-wrapper mb-30">
        <label htmlFor="">Make Admin*</label>
        <div className="skills-wrapper">
          <div className="dash-input-wrapper mb-30">
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                type="email"
                placeholder="Make admin by email address"
                {...register('email')}
                name="email"
              />
              {errors?.email && <ErrorMsg msg={errors?.email.message} />}
              <button
                disabled={isSubmitting}
                className="btn btn-primary mt-3 p-3"
              >
                {isSubmitting ? 'Submitting...' : 'Make Admin'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Skills end */}
    </div>
  );
};
export default DashboardMakeAdmin;

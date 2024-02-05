'use client';
import ErrorMsg from '@/app/components/common/error-msg';
import { notifyError, notifySuccess } from '@/utils/toast';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import React from 'react';

import { Resolver, useForm } from 'react-hook-form';

type IFormData = {
  email: string;
};

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  return {
    values: values.email ? values : '',
    errors: !values.email
      ? {
          email: {
            type: 'required',
            message: 'Email is required.'
          }
        }
      : {}
  };
};

const ResetPassword = () => {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver });

  const onSubmit = async (data: any) => {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const firstFactor = await signIn.create({
          strategy: 'reset_password_email_code',
          identifier: data.email
        });

        if (firstFactor.status === 'needs_first_factor') {
          router.push('/sign-in/reset-password/confirm');
          notifySuccess('We sent you a 6-digit verification code.');
        }
      } catch (err: any) {
        notifyError(`Erorr: ${err.errors[0].longMessage}`);
      }
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div className="container">
          <div className="user-data-form">
            <div className="text-center">
              <h2>Reset Password</h2>
              <p>
                Enter your email address and we will send you a verification
                code
              </p>
            </div>

            <div className="form-wrapper m-auto">
              <div className="tab-content mt-40">
                <div>
                  <div className="input-group-meta position-relative mb-25">
                    <input
                      type="email"
                      placeholder="Enter  email address"
                      {...register('email', { required: 'Code is required!' })}
                      name="email"
                    />
                    <div className="help-block with-errors">
                      <ErrorMsg msg={errors.email?.message || ''} />
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-eleven fw-500 tran3s d-block mt-20"
                    >
                      {isPending ? 'Sending...' : 'continue'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
};
export default ResetPassword;

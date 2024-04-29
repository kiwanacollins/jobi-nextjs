'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Resolver, useForm } from 'react-hook-form';
import ErrorMsg from '../common/error-msg';
import icon from '@/assets/images/icon/icon_60.svg';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { notifyError, notifySuccess } from '@/utils/toast';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

// form data type
type IFormData = {
  email: string;
  password: string;
};

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  return {
    values: values.email ? values : {},
    errors: !values.email
      ? {
          email: {
            type: 'required',
            message: 'Email is required.'
          },
          password: {
            type: 'required',
            message: 'Password is required.'
          }
        }
      : {}
  };
};

const LoginForm = () => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormData>({ resolver });
  // on submit
  const onSubmit = (data: IFormData) => {
    if (!isLoaded) return;
    startTransition(async () => {
      try {
        const result = await signIn.create({
          identifier: data.email,
          password: data.password
        });

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          revalidatePath('/');
          router.push(`/`);
          notifySuccess('Login successful!');
        } else {
          /* Investigate why the login hasn't completed */
          console.log(result);
        }
      } catch (err: any) {
        notifyError(`Erorr: ${err.errors[0].longMessage}`);
      }
    });

    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>Email*</label>
            <input
              type="email"
              placeholder="james@example.com"
              {...register('email', { required: `Email is required!` })}
              name="email"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.email?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-20">
            <label>Password*</label>
            <input
              type={`${showPass ? 'text' : 'password'}`}
              placeholder="Enter Password"
              className="pass_log_id"
              {...register('password', { required: `Password is required!` })}
              name="password"
            />
            <span
              className="placeholder_icon"
              onClick={() => setShowPass(!showPass)}
            >
              <span className={`passVicon ${showPass ? 'eye-slash' : ''}`}>
                <Image src={icon} alt="icon" />
              </span>
            </span>
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.password?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="agreement-checkbox d-flex justify-content-between align-items-center">
            <div>
              <input type="checkbox" id="remember1" />
              <label htmlFor="remember">Keep me logged in</label>
            </div>
            <Link href="/sign-in/reset-password">Forget Password?</Link>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            disabled={isPending}
            className="btn-eleven fw-500 tran3s d-block mt-20"
          >
            {isPending ? 'Loading...' : 'Login'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;

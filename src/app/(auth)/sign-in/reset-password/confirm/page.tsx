'use client';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import icon from '@/assets/images/icon/icon_60.svg';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { notifyError, notifySuccess } from '@/utils/toast';
import ErrorMsg from '@/app/components/common/error-msg';
import Image from 'next/image';

// form data type
const resetPasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
    code: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

type Inputs = z.infer<typeof resetPasswordSchema>;

const ResetPasswordConfirm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      code: ''
    }
  });
  const onSubmit = async (data: Inputs) => {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const attemptFirstFactor = await signIn.attemptFirstFactor({
          strategy: 'reset_password_email_code',
          code: data.code,
          password: data.password
        });

        if (attemptFirstFactor.status === 'needs_second_factor') {
          // TODO: implement 2FA (requires clerk pro plan)
        } else if (attemptFirstFactor.status === 'complete') {
          await setActive({
            session: attemptFirstFactor.createdSessionId
          });
          router.push(`/`);
          notifySuccess('Password reset successfully.');
        } else {
          console.error(attemptFirstFactor);
        }
      } catch (err: any) {
        console.log(err);
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
                    <label>Password*</label>
                    <input
                      type={`${showPass ? 'text' : 'password'}`}
                      placeholder="Password"
                      {...register('password', {
                        required: 'Code is required!'
                      })}
                      name="password"
                    />
                    <span
                      className="placeholder_icon"
                      onClick={() => setShowPass(!showPass)}
                    >
                      <span
                        className={`passVicon ${showPass ? 'eye-slash' : ''}`}
                      >
                        <Image src={icon} alt="icon" />
                      </span>
                    </span>
                    <div className="help-block with-errors">
                      <ErrorMsg msg={errors.password?.message || ''} />
                    </div>
                  </div>
                  <div className="input-group-meta position-relative mb-25">
                    <label>Confirm Password*</label>
                    <input
                      type={`${showConfirmPass ? 'text' : 'password'}`}
                      placeholder="confirm password"
                      {...register('confirmPassword', {
                        required: 'Confirm password is required!'
                      })}
                      name="confirmPassword"
                    />
                    <span
                      className="placeholder_icon"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                    >
                      <span
                        className={`passVicon ${showConfirmPass ? 'eye-slash' : ''}`}
                      >
                        <Image src={icon} alt="icon" />
                      </span>
                    </span>

                    <div className="help-block with-errors">
                      <ErrorMsg msg={errors.confirmPassword?.message || ''} />
                    </div>
                  </div>
                  <div className="input-group-meta position-relative mb-25">
                    <label>Code*</label>
                    <input
                      type="text"
                      placeholder="Enter code"
                      {...register('code', {
                        required: 'Confirm password is required!'
                      })}
                      name="code"
                    />
                    <div className="help-block with-errors">
                      <ErrorMsg msg={errors.code?.message || ''} />
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn-eleven fw-500 tran3s d-block mt-20"
                    >
                      {isPending ? 'Reseting...' : 'Reset Password'}
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
export default ResetPasswordConfirm;

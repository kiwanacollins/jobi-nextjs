'use client';

import ErrorMsg from '@/app/components/common/error-msg';
import CandidateRegisterForm from '@/app/components/forms/register-form';
import * as Yup from 'yup';
import { useSignUp } from '@clerk/nextjs';
import { register } from 'module';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

// form data type
type IFormData = {
  code: string;
};

// schema
const schema = Yup.object().shape({
  code: Yup.string().required().label('code')
});

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  return {
    values: values.code ? values : '',
    errors: !values.code
      ? {
          code: {
            type: 'required',
            message: 'Code is required.'
          }
        }
      : {}
  };
};

const Page = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<IFormData>({ resolver });

  // Verify User Email Code
  function onSubmit(data: IFormData) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: data.code
        });
        if (completeSignUp.status !== 'complete') {
          /*  investigate the response, to see if there was an error
             or if the user needs to complete more steps.*/
          console.log(JSON.stringify(completeSignUp, null, 2));
        }
        if (completeSignUp.status === 'complete') {
          await setActive({ session: completeSignUp.createdSessionId });

          router.push(`/`);
        }
      } catch (err) {
        // catchClerkError(err);
        console.log(err);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="registration-section position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
        <div className="container">
          <div className="user-data-form">
            <div className="text-center">
              <h2>Verify Email</h2>
            </div>
            <div className="form-wrapper m-auto">
              <div className="tab-content mt-40">
                <div>
                  <div className="input-group-meta position-relative mb-25">
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      {...register('code', { required: 'Code is required!' })}
                      name="code"
                    />
                    <div className="help-block with-errors">
                      {/* <ErrorMsg msg={'' ? errors?.email?.message! : ''} /> */}
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn-eleven fw-500 tran3s d-block mt-20"
                      disabled={isPending}
                    >
                      {isPending ? 'Loading...' : ' Create Account'}
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
export default Page;

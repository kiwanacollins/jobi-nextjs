'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import * as Yup from 'yup';
import { Resolver, useForm } from 'react-hook-form';
import ErrorMsg from '../common/error-msg';
import icon from '@/assets/images/icon/icon_60.svg';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { notifyError, notifySuccess } from '@/utils/toast';

// form data type
type IFormData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
};

interface IRegisterFormProps {
  userRole: string;
}

// schema
const schema = Yup.object().shape({
  firstName: Yup.string().required().label('firstName'),
  lastName: Yup.string().required().label('lastName'),
  username: Yup.string().required().label('username'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password')
});

// resolver
const resolver: Resolver<IFormData> = async (values) => {
  return {
    values: values.firstName ? values : {},
    errors: !values.firstName
      ? {
          firstName: {
            type: 'required',
            message: 'First Name is required.'
          },
          lastName: {
            type: 'required',
            message: 'Last Name is required.'
          },
          username: {
            type: 'required',
            message: 'username is required.'
          },
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

const RegisterForm = ({ userRole }: IRegisterFormProps) => {
  const [showPass, setShowPass] = useState<boolean>(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isTermAccepted, setIsTermAccepted] = useState(false);

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
        await signUp.create({
          firstName: data.firstName,
          lastName: data.lastName,
          emailAddress: data.email,
          password: data.password,
          username: data.username
        });

        // Send email verification code
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code'
        });

        router.push('/register/verify-email');
        notifySuccess('Check your email for verification code');
      } catch (err: any) {
        notifyError(`Erorr: ${err.errors[0].longMessage}`);
      }
    });
    reset();
  };

  const handleTermsChange = () => {
    setIsTermAccepted(!isTermAccepted);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-12">
          <div className="input-group-meta d-md-flex justify-content-lg-between gap-md-4 position-relative mb-25">
            <div>
              <label>First Name*</label>
              <input
                type="text"
                placeholder="James Brower"
                {...register('firstName', {
                  required: `First Name is required!`
                })}
                name="firstName"
              />
              <div className="help-block with-errors">
                <ErrorMsg msg={errors.firstName?.message!} />
              </div>
            </div>
            <div>
              <label>Last Name*</label>
              <input
                type="text"
                placeholder="James Brower"
                {...register('lastName', { required: `Name is required!` })}
                name="lastName"
              />
              <div className="help-block with-errors">
                <ErrorMsg msg={errors.lastName?.message!} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="input-group-meta position-relative mb-25">
            <label>username*</label>
            <input
              type="text"
              placeholder="choose a username"
              {...register('username', { required: `username is required!` })}
              name="username"
            />
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.username?.message!} />
            </div>
          </div>
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
                <Image src={icon} alt="pass-icon" />
              </span>
            </span>
            <div className="help-block with-errors">
              <ErrorMsg msg={errors.password?.message!} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className=" d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                onChange={handleTermsChange}
                type="checkbox"
                name="remember"
                id="remember"
                className="form-check-input "
              />
              <label className="form-check-label" htmlFor="remember">
                By hitting the Register button, you agree to the{' '}
                <a href="#">Terms conditions</a> &{' '}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
          </div>
        </div>
        <div className="col-12">
          <button
            type="submit"
            className={`btn  btn-eleven fw-500 tran3s d-block mt-20 ${
              !isTermAccepted && `btn-secondary`
            }`}
            disabled={!isTermAccepted}
          >
            Register
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;

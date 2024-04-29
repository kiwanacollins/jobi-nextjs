import React from 'react';
import Image from 'next/image';
import google from '@/assets/images/icon/google.png';
import facebook from '@/assets/images/icon/facebook.png';
import Link from 'next/link';
import LoginForm from '../forms/login-form';

const SignInArea = () => {
  return (
    <div className="registration-section  position-relative pt-100 lg-pt-80 pb-150 lg-pb-80">
      <div className="">
        <div className="container">
          <div className="user-data-form modal-content">
            <div className="text-center">
              <h2>Hi, Welcome Back!</h2>
              <p>
                Still do not have an account?{' '}
                <Link href="/register">Sign up</Link>
              </p>
            </div>
            <div className="form-wrapper m-auto">
              <LoginForm />
              <div className="d-flex align-items-center mt-30 mb-10">
                <div className="line"></div>
                <span className="pe-3 ps-3">OR</span>
                <div className="line"></div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <a
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                  >
                    <Image src={google} alt="google-img" />
                    <span className="ps-2">Login with Google</span>
                  </a>
                </div>
                <div className="col-md-6">
                  <a
                    href="#"
                    className="social-use-btn d-flex align-items-center justify-content-center tran3s w-100 mt-10"
                  >
                    <Image src={facebook} alt="facebook-img" />
                    <span className="ps-2">Login with Facebook</span>
                  </a>
                </div>
              </div>
              <p className="text-center mt-10">
                Do not have an account?{' '}
                <Link href="/register" className="fw-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInArea;

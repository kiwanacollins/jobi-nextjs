'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/images/logo/logo_01.png';
import dark_logo from '@/assets/images/logo/logo_04.png';
import Menus from './component/menus';
import useSticky from '@/hooks/use-sticky';

import { SignedIn, UserButton } from '@clerk/nextjs';
import { IUser } from '@/database/user.model';

interface Props {
  dark_style?: boolean;
  userId?: string;
  currentUser?: IUser | null;
}

const HeaderSix = ({ dark_style = false, userId, currentUser }: Props) => {
  const { sticky } = useSticky();

  return (
    <>
      <header
        className={`theme-main-menu menu-overlay ${
          dark_style ? '' : 'menu-style-two'
        } sticky-menu ${sticky ? 'fixed' : ''}`}
      >
        <div className="inner-content position-relative">
          <div className="top-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="logo order-lg-0">
                <Link href="/" className="d-flex align-items-center">
                  <Image
                    src={dark_style ? dark_logo : logo}
                    alt="logo"
                    priority
                  />
                </Link>
              </div>
              <div className="right-widget ms-auto ms-lg-0 order-lg-2">
                <ul className="d-flex align-items-center style-none">
                  {!userId && (
                    <li>
                      <a
                        href="/sign-in"
                        className={`fw-500 login-btn-three ${
                          dark_style ? 'dark-style' : ''
                        } tran3s`}
                        // data-bs-toggle="modal"
                        // data-bs-target="#loginModal"
                      >
                        Login/Sign up
                      </a>
                    </li>
                  )}

                  <SignedIn>
                    <li className="nav-item dropdown Dashboard ">
                      <a
                        className="nav-link fw-bold me-3  text-white  dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        aria-expanded="false"
                      >
                        Dashboard
                      </a>
                      <ul className="dropdown-menu p-3">
                        {currentUser?.role === 'employee' && (
                          <li>
                            <Link
                              href={'/dashboard/employ-dashboard'}
                              className="dropdown-item"
                            >
                              <span>Employer Dashboard</span>
                            </Link>
                          </li>
                        )}
                        {currentUser?.isAdmin && (
                          <li>
                            <Link
                              href={'/dashboard/admin-dashboard'}
                              className="dropdown-item"
                            >
                              <span>Admin Dashboard</span>
                            </Link>
                          </li>
                        )}
                      </ul>
                    </li>

                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: {
                            height: '50px',
                            width: '50px'
                          }
                        },
                        variables: {
                          colorPrimary: '#ff7000'
                        }
                      }}
                    />
                  </SignedIn>

                  {currentUser?.role === 'employee' && (
                    <li className="d-none d-md-block ms-3">
                      <Link href="/register" className="btn-five">
                        Post a job
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <nav className="navbar navbar-expand-lg p0 ms-3 ms-lg-5 order-lg-1">
                <button
                  className="navbar-toggler d-block d-lg-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarNav"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                    <li className="d-block d-lg-none">
                      <div className="logo">
                        <Link href="/" className="d-block">
                          <Image
                            src={dark_style ? dark_logo : logo}
                            alt="logo"
                            priority
                            width="100"
                          />
                        </Link>
                      </div>
                    </li>
                    {/* menus start */}
                    <Menus
                      userId={userId as string}
                      role={currentUser?.role as string}
                    />
                    {/* menus end */}
                    {currentUser?.role === 'employee' && (
                      <li className="d-md-none mt-5">
                        <Link
                          href="/dashboard/employ-dashboard/submit-job"
                          className="btn-five w-100"
                        >
                          Post a job
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* login modal start */}
      {/* <LoginModal /> */}
      {/* login modal end */}
    </>
  );
};

export default HeaderSix;

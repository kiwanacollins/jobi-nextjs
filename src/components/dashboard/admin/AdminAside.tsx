/* eslint-disable camelcase */
'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import profile_icon_1 from '@/assets/dashboard/images/icon/icon_23.svg';
import profile_icon_2 from '@/assets/dashboard/images/icon/icon_24.svg';
import profile_icon_3 from '@/assets/dashboard/images/icon/icon_25.svg';
import logout from '@/assets/dashboard/images/icon/icon_9.svg';
import nav_1 from '@/assets/dashboard/images/icon/icon_1.svg';
import nav_1_active from '@/assets/dashboard/images/icon/icon_1_active.svg';
import nav_2 from '@/assets/dashboard/images/icon/icon_2.svg';
import nav_2_active from '@/assets/dashboard/images/icon/icon_2_active.svg';
import nav_3 from '@/assets/dashboard/images/icon/icon_3.svg';
import nav_3_active from '@/assets/dashboard/images/icon/icon_3_active.svg';
import nav_4 from '@/assets/dashboard/images/icon/icon_4.svg';
import nav_4_active from '@/assets/dashboard/images/icon/icon_4_active.svg';
import nav_7 from '@/assets/dashboard/images/icon/icon_7.svg';
import nav_7_active from '@/assets/dashboard/images/icon/icon_7_active.svg';
import LogoutModal from '../../common/popup/logout-modal';
import { UserButton, useAuth, useClerk } from '@clerk/nextjs';
import { getUserById } from '@/lib/actions/user.action';
import { IUser } from '@/database/user.model';
import Swal from 'sweetalert2';

// nav data
const nav_data: {
  id: number;
  icon: StaticImageData;
  icon_active: StaticImageData;
  link: string;
  title: string;
  sub_menus?: {
    icon: StaticImageData;
    icon_active: StaticImageData;
    link: string;
    title: string;
  }[];
}[] = [
  {
    id: 1,
    icon: nav_1,
    icon_active: nav_1_active,
    link: '/dashboard/admin-dashboard',
    title: 'Dashboard'
  },
  {
    id: 2,
    icon: nav_1,
    icon_active: nav_1_active,
    link: '/',
    title: 'Home'
  },
  {
    id: 4,
    icon: nav_1,
    icon_active: nav_1_active,
    link: '/dashboard/admin-dashboard/categories',
    title: 'Categories'
  },
  {
    id: 5,
    icon: nav_2,
    icon_active: nav_2_active,
    link: '/dashboard/admin-dashboard/make-admin',
    title: 'Make admin'
  },
  {
    id: 8,
    icon: nav_4,
    icon_active: nav_4_active,
    link: '/dashboard/admin-dashboard/messages',
    title: 'Messages'
  },
  {
    id: 9,
    icon: nav_3,
    icon_active: nav_3_active,
    link: '/dashboard/admin-dashboard/received-data',
    title: 'Subscribed Emails'
  },
  {
    id: 10,
    icon: nav_3,
    icon_active: nav_3_active,
    link: '/dashboard/admin-dashboard/createBlog',
    title: 'Create Blog'
  },
  {
    id: 11,
    icon: nav_3,
    icon_active: nav_3_active,
    link: '/dashboard/admin-dashboard/blogs',
    title: 'Blogs'
  },
  {
    id: 12,
    icon: nav_7,
    icon_active: nav_7_active,
    link: '/dashboard/admin-dashboard/setting',
    title: 'Account Settings'
  }
];
// props type
type IProps = {
  isOpenSidebar: boolean;
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminAside = ({ isOpenSidebar, setIsOpenSidebar }: IProps) => {
  const pathname = usePathname();
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<IUser>({} as IUser);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const mongoUser = await getUserById({ userId });
      setCurrentUser(mongoUser);
    };
    fetchCurrentUser();
  }, [userId]);

  const handleLogoutButton = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        signOut(() => router.push('/'));
        // Swal.fire({
        //   title: 'Logged out!',
        //   text: 'Logged out successfully!',
        //   icon: 'success'
        // });
      }
    });
  };

  return (
    <>
      <aside className={`dash-aside-navbar ${isOpenSidebar ? 'show' : ''}`}>
        <div className="position-relative">
          <div className="logo text-md-center d-md-block d-flex align-items-center justify-content-between">
            <Link href="/">
              <strong className="text-decoration-none" style={{fontSize: '20px', color: '#2E7D4A'}}>Ugandan Jobs</strong>
            </Link>
            <button
              onClick={() => setIsOpenSidebar(false)}
              className="close-btn d-block d-md-none"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="user-data">
            <div className="user-avatar online position-relative rounded-circle">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      height: '75px',
                      width: '75px'
                    }
                  },
                  variables: {
                    colorPrimary: '#ff7000'
                  }
                }}
              />
            </div>
            <div className="user-name-data">
              <button
                className="user-name dropdown-toggle"
                type="button"
                id="profile-dropdown"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                {currentUser?.name}
              </button>
              <ul className="dropdown-menu" aria-labelledby="profile-dropdown">
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="/dashboard/admin-dashboard/setting"
                  >
                    <Image
                      src={profile_icon_1}
                      alt="icon"
                      className="lazy-img"
                    />
                    <span className="ms-2 ps-1">Profile</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item d-flex align-items-center"
                    href="/dashboard/admin-dashboard/setting"
                  >
                    <Image
                      src={profile_icon_2}
                      alt="icon"
                      className="lazy-img"
                    />
                    <span className="ms-2 ps-1">Account Settings</span>
                  </Link>
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <Image
                      src={profile_icon_3}
                      alt="icon"
                      className="lazy-img"
                    />
                    <span className="ms-2 ps-1">Notification</span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogoutButton}
                    className="d-flex w-100 text-decoration-none align-items-center logout-btn"
                  >
                    <Image src={logout} alt="icon" className="lazy-img" />
                    <span className="ms-2 text-decoration-none ps-1">
                      Logout
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <nav className="dasboard-main-nav">
            <ul className="style-none">
              {nav_data.map((m) => {
                const isActive = pathname === m.link;
                return (
                  <li key={m.id} onClick={() => setIsOpenSidebar(false)}>
                    {m.sub_menus ? (
                      <div className="dropdown">
                        <a
                          className={`dropdown-toggle d-flex text-decoration-none w-100 align-items-center ${isActive ? 'active' : ''}`}
                          href="#"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <Image
                            src={isActive ? m.icon_active : m.icon}
                            alt="icon"
                            className="lazy-img"
                          />
                          <span>{m.title}</span>
                        </a>
                        <ul className="dropdown-menu px-2">
                          {m.sub_menus.map((subItem, index) => (
                            <li key={index}>
                              <Link
                                href={subItem.link}
                                className={` dropdown-item  d-flex text-decoration-none w-100 align-items-start ${isActive ? 'active' : ''}`}
                              >
                                <Image
                                  src={isActive ? m.icon_active : m.icon}
                                  alt="icon"
                                  className="lazy-img"
                                />
                                <span> {subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link
                        href={m.link}
                        className={`d-flex text-decoration-none w-100 align-items-center ${isActive ? 'active' : ''}`}
                      >
                        <Image
                          src={isActive ? m.icon_active : m.icon}
                          alt="icon"
                          className="lazy-img"
                        />
                        <span>{m.title}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="profile-complete-status">
            <div className="progress-value fw-500">87%</div>
            <div className="progress-line position-relative">
              <div className="inner-line" style={{ width: '80%' }}></div>
            </div>
            <p>Profile Complete</p>
          </div>

          {/* Logout button start */}
          {/* <button className="d-flex w-100 text-decoration-none align-items-center logout-btn">
            <Image src={logout} alt="icon" className="lazy-img" />
            <span>Logout</span>
          </button> */}
          {/* Logout button end */}
        </div>
      </aside>
      {/* LogoutModal star */}
      <LogoutModal />
      {/* LogoutModal end */}
    </>
  );
};

export default AdminAside;

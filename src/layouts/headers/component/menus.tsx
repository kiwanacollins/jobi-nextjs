import React from 'react';
import menu_data from '@/data/menu-data';
import Link from 'next/link';
import { SignedIn } from '@clerk/nextjs';

const Menus = ({
  role,
  userId,
  isAdmin,
  handleNavCollapse
}: {
  role: string;
  userId: string;
  isAdmin?: boolean;
  handleNavCollapse: () => void;
}) => {
  return (
    <>
      {menu_data.map((menu) =>
        menu.sub_menus ? (
          <li
            key={menu.id}
            className={`nav-item dropdown ${
              menu.title === 'Dashboard' ? 'dashboard-menu' : ''
            }`}
          >
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              {menu.title}
            </a>
            <ul className="dropdown-menu">
              {menu.sub_menus.map((s, i) => (
                <li key={i}>
                  <Link href={s.link} className="dropdown-item">
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ) : menu.mega_menus ? (
          <li key={menu.id} className="nav-item dropdown mega-dropdown-sm">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              {menu.title}
            </a>
            <ul className="dropdown-menu">
              <li className="row gx-1">
                {menu.mega_menus.map((m) => (
                  <div key={m.id} className="col-md-4">
                    <div className="menu-column">
                      <h6 className="mega-menu-title">{m.title}</h6>
                      <ul className="style-none mega-dropdown-list">
                        {m.sub_menus.map((ms, i) => (
                          <li key={i}>
                            <Link href={ms.link} className="dropdown-item">
                              <span>{ms.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </li>
            </ul>
          </li>
        ) : (
          <li key={menu.id} className="nav-item" onClick={handleNavCollapse}>
            <Link className="nav-link" href={menu.link}>
              {menu.title}
            </Link>
          </li>
        )
      )}

      {role !== 'employee' && (
        <li className="nav-item" onClick={handleNavCollapse}>
          <Link className="nav-link" href={'/wishlist'}>
            Wishlist
          </Link>
        </li>
      )}
      <SignedIn>
        {(role || isAdmin === true) && (
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
              {role === 'employee' && (
                <li>
                  <Link
                    href={'/dashboard/employ-dashboard'}
                    className="dropdown-item"
                  >
                    <span>Employer Dashboard</span>
                  </Link>
                </li>
              )}
              {isAdmin && (
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
        )}
      </SignedIn>
    </>
  );
};

export default Menus;

'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
// import notifi from '@/assets/dashboard/images/icon/icon_11.svg';
// import notify_icon_1 from '@/assets/dashboard/images/icon/icon_36.svg';
// import notify_icon_2 from '@/assets/dashboard/images/icon/icon_37.svg';
// import notify_icon_3 from '@/assets/dashboard/images/icon/icon_38.svg';
import search from '@/assets/dashboard/images/icon/icon_10.svg';
import { formUrlQuery, removeKeysFromQuery } from '@/utils/utils';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

// notification item
export function NotificationItem({
  icon,
  main,
  time,
  isUnread
}: {
  icon: StaticImageData;
  main: string;
  time: string;
  isUnread: boolean;
}) {
  return (
    <li className={`d-flex align-items-center ${isUnread ? 'unread' : ''}`}>
      <Image src={icon} alt="icon" className="lazy-img icon" />
      <div className="flex-fill ps-2">
        <h6>You have {main} new mails</h6>
        <span className="time">{time} hours ago</span>
      </div>
    </li>
  );
}
// props type
type IProps = {
  setIsOpenSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  route?: string;
};
const DashboardHeader = ({ setIsOpenSidebar, route }: IProps) => {
  // handle click to open
  const handleOpen = () => {
    if (setIsOpenSidebar) {
      setIsOpenSidebar(true);
    }
  };
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const [keyword, setKeyword] = useState<string>(query || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: keyword
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['query']
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, pathname, router, searchParams, query, route]);

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center gap-3  justify-content-end">
        <button
          onClick={handleOpen}
          className="dash-mobile-nav-toggler d-block d-md-none me-auto"
        >
          <span></span>
        </button>
        <form className="search-form">
          <input
            type="text"
            placeholder="Search here.."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button disabled>
            <Image src={search} alt="search" className="lazy-img m-auto" />
          </button>
        </form>
        {/* <div className="profile-notification ms-2 ms-md-5 me-4">
          <button
            className="noti-btn dropdown-toggle"
            type="button"
            id="notification-dropdown"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            <Image src={notifi} alt="Notification" className="lazy-img" />
            <div className="badge-pill"></div>
          </button>
          <ul className="dropdown-menu" aria-labelledby="notification-dropdown">
            <li>
              <h4>Notification</h4>
              <ul className="style-none notify-list">
                <NotificationItem
                  icon={notify_icon_1}
                  main="3"
                  time="3"
                  isUnread={true}
                />
                <NotificationItem
                  icon={notify_icon_2}
                  main="5"
                  time="6"
                  isUnread={false}
                />
                <NotificationItem
                  icon={notify_icon_3}
                  main="7"
                  time="9"
                  isUnread={true}
                />
              </ul>
            </li>
          </ul>
        </div> */}
        <div>
          <Link
            href="/dashboard/employ-dashboard/submit-job"
            className="job-post-btn tran3s"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

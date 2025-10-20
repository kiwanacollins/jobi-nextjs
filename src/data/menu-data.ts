import { IMenuData } from '@/types/menu-data-type';

const menu_data: IMenuData[] = [
  {
    id: 1,
    link: '/',
    title: 'Home'
    // sub_menus: [
    //   { link: '/', title: 'Home 1' },
    //   { link: '/home-2', title: 'Home 2' },
    //   { link: '/home-3', title: 'Home 3' },
    //   { link: '/home-4', title: 'Home 4' },
    //   { link: '/home-5', title: 'Home 5' },
    //   { link: '/home-6', title: 'Home 6' },
    //   { link: '/home-7', title: 'Home 7' }
    // ]
  },
  {
    id: 2,
    link: '/jobs',
    title: 'Jobs'
  },
  // {
  //   id: 3,
  //   link: '/candidates',
  //   title: 'Explore'
  // },
  // {
  //   id: 4,
  //   link: '/company',
  //   title: 'Company'
  // },
  {
    id: 3,
    link: '/about-us',
    title: 'About Us'
  },
  {
    id: 5,
    link: '/blogs',
    title: 'Blogs'
  },
  {
    id: 6,
    link: '/contact',
    title: 'Contact'
  }
];

export default menu_data;

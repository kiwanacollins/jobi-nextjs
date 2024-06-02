// import cate_icon_1 from '@/assets/images/icon/icon_63.svg';
// import cate_icon_2 from '@/assets/images/icon/icon_64.svg';
// import cate_icon_3 from '@/assets/images/icon/icon_65.svg';
// import cate_icon_4 from '@/assets/images/icon/icon_68.svg';
// import cate_icon_6 from '@/assets/images/icon/icon_67.svg';
import driverIcon from '@/assets/images/icon/driver-icon.png';
import welderIcon from '@/assets/images/icon/welder-icon.png';
import IconElectrican from '@/assets/images/icon/electrician.png';
import IconCooking from '@/assets/images/icon/cooking.png';
import IconEngineer from '@/assets/images/icon/engineer.png';
import IconChanic from '@/assets/images/icon/machanic.png';
import { StaticImageData } from 'next/image';

interface IcategoryMenu {
  id: number;
  icon: StaticImageData;
  title: string;
  count: string;
  bg_clr?: string;
}

export const categoryMenu: IcategoryMenu[] = [
  {
    id: 1,
    icon: driverIcon,
    title: 'Driver',
    count: '12k+',
    bg_clr: '#EAFBFD'
  },
  {
    id: 2,
    icon: welderIcon,
    title: 'Welder',
    count: '7k+',
    bg_clr: '#FFFAEC'
  },
  {
    id: 3,
    icon: IconElectrican,
    title: 'Electrician',
    count: '310k+',
    bg_clr: '#FFEBFB'
  },

  {
    id: 4,
    icon: IconCooking,
    title: 'Chef',
    count: '420k+',
    bg_clr: '#E8F7E9'
  },
  {
    id: 5,
    icon: IconEngineer,
    title: 'Engineer',
    count: '3k+',
    bg_clr: '#F7F5FF'
  },
  {
    id: 6,
    icon: IconChanic,
    title: 'Mechanic',
    count: '150k+',
    bg_clr: '#FFF3EA'
  }
];

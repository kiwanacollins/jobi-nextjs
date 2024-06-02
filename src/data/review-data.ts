import { StaticImageData } from 'next/image';
import user_1 from '@/assets/images/assets/img_14.jpg';
import user_2 from '@/assets/images/assets/img_15.jpg';
import user_3 from '@/assets/images/assets/img_16.jpg';
// slider data
export const slider_data: {
  id: number;
  review_text: string;
  review_start: number[];
  desc: string;
  name: string;
  location: string;
  user: StaticImageData;
}[] = [
  {
    id: 1,
    review_text: 'Impressive!',
    review_start: [1, 2, 3, 4],
    desc: "Amazing theme, I'm using it for our internal process & procedures, and it's working very well.",
    name: 'John Doe',
    location: 'Sydney',
    user: user_1
  },
  {
    id: 2,
    review_text: 'Great work!!',
    review_start: [1, 2, 3, 4, 5],
    desc: 'Great service, highly recommend. Friendly staff and excellent quality products. Will definitely be returning!',
    name: 'James Stephens',
    location: 'USA',
    user: user_2
  },
  {
    id: 3,
    review_text: 'Impressive!',
    review_start: [1, 2, 3, 4, 5],
    desc: "Absolutely amazing! The service was impeccable, and the products exceeded my expectations. I'll be back!",
    name: 'John Doe',
    location: 'Sydney',
    user: user_3
  }
];

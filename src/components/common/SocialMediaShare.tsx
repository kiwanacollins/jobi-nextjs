'use client';

import { hostName } from '@/constants';
import { usePathname } from 'next/navigation';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon
} from 'react-share';

const SocialMediaShare = ({ url }: { url?: string }) => {
  const pathName = usePathname();
  const sharedUrl = url || `${hostName}${pathName}`;

  return (
    <ul className="d-flex gap-2 share-icon align-items-center style-none pb-20">
      <li>Share:</li>
      <li>
        <FacebookShareButton url={sharedUrl}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton url={sharedUrl}>
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
      </li>
      <li>
        <LinkedinShareButton url={sharedUrl}>
          <LinkedinIcon size={32} round={true} />
        </LinkedinShareButton>
      </li>
      <li>
        <WhatsappShareButton url={sharedUrl}>
          <WhatsappIcon size={32} round={true} />
        </WhatsappShareButton>
      </li>
    </ul>
  );
};
export default SocialMediaShare;

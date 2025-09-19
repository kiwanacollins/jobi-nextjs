import Link from 'next/link';
import React from 'react';

const SocialLinks = () => {
  const defaultMsg =
    'Hello from Ugandan Jobs, I would like to know about your services';
  const whatsappUrl = `https://wa.me/${'+8801938056537'}?text=${encodeURIComponent(
    defaultMsg
  )}`;
  return (
    <>
      <li>
        <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <i className="bi bi-whatsapp"></i>
        </Link>
      </li>

      <li>
        <Link href="mailto:rakibhasanroky0@gmail.com">
          <i className="bi bi-google"></i>
        </Link>
      </li>
      <li>
        <Link
          href="https://www.instagram.com/rakibtweets"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bi bi-instagram"></i>
        </Link>
      </li>
    </>
  );
};

export default SocialLinks;

import Link from 'next/link';
import React from 'react';

const SocialLinks = () => {
  const defaultMsg = 'Hello, I would like to know about your services';
const whatsappUrl = `https://wa.me/${"+8801938056537"}?text=${encodeURIComponent(
  defaultMsg
)}`;
  return (
    <>
      <li>
        <Link  href={whatsappUrl} 
        target="_blank"
      rel="noopener noreferrer">
          <i className="bi bi-whatsapp"></i>
        </Link>
      </li>
      <li>
        <a href="#">
          <i className="bi bi-dribbble"></i>
        </a>
      </li>
      <li>
        <a href="#">
          <i className="bi bi-google"></i>
        </a>
      </li>
      <li>
        <a href="#">
          <i className="bi bi-instagram"></i>
        </a>
      </li>
    </>
  );
};

export default SocialLinks;
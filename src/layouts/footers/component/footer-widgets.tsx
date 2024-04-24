import Link from 'next/link';
import React from 'react';

export function WidgetOne({
  cls,
  style_2
}: {
  cls: string;
  style_2?: boolean;
}) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>
        Services
      </h5>
      <ul className="footer-nav-link  style-none">
        <li>
          <Link className="text-decoration-none" href="/jobs">
            Browse Jobs
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/company-v1">
            Companies
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/candidates">
            Candidates
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/pricing">
            Pricing
          </Link>
        </li>
      </ul>
    </div>
  );
}

export function WidgetTwo({
  cls,
  style_2
}: {
  cls: string;
  style_2?: boolean;
}) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>Company</h5>
      <ul className="footer-nav-link style-none">
        <li>
          <Link className="text-decoration-none" href="/about-us">
            About us
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/blogs">
            Blogs
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/faq">
            FAQ’s
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/contact">
            Contact
          </Link>
        </li>
      </ul>
    </div>
  );
}

export function WidgetThree({
  cls,
  style_2
}: {
  cls: string;
  style_2?: boolean;
}) {
  return (
    <div className={`${cls} mb-20`}>
      <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>Support</h5>
      <ul className="footer-nav-link style-none">
        <li>
          <Link className="text-decoration-none" href="/contact">
            Terms of use
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/terms">
            Terms & conditions
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/contact">
            Privacy
          </Link>
        </li>
        <li>
          <Link className="text-decoration-none" href="/contact">
            Cookie policy
          </Link>
        </li>
      </ul>
    </div>
  );
}

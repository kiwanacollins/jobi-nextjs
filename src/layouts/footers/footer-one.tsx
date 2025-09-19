'use client';
import React, { useState } from 'react';
import Link from 'next/link';
// internal
import shape from '@/assets/images/shape/shape_28.svg';
import { WidgetOne, WidgetThree, WidgetTwo } from './component/footer-widgets';
import SocialLinks from './component/social-links';
import { subscribeToNewsletter } from '@/lib/actions/admin.action';
import Swal from 'sweetalert2';
import Image from 'next/image';

const FooterOne = ({
  bottom_bg,
  style_2 = false,
  style_3 = false
}: {
  bottom_bg?: string;
  style_2?: boolean;
  style_3?: boolean;
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter your email address!'
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address!'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Thank you for subscribing to our newsletter!'
        });
        setEmail('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Subscription Failed',
          text: result.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={`footer-one ${style_2 ? 'bg-two white-version' : ''}`}>
      <div className="container">
        <div className="inner-wrapper">
          <div className="row">
            <div className="col-lg-2 col-md-3 footer-intro mb-15">
              <div className="logo mb-15">
                <Link href="/" className="d-flex align-items-center">
                  <strong className="text-decoration-none" style={{fontSize: '20px', color: style_2 ? '#fff' : '#244034'}}>Ugandan Jobs</strong>
                </Link>
              </div>
              <Image
                src={shape}
                alt="shape"
                className="lazy-img mt-80 sm-mt-30 sm-mb-20"
              />
            </div>
            {/* widget one */}
            <WidgetOne style_2={style_2} cls="col-lg-2 col-md-3 col-sm-4" />
            {/* widget two */}
            <WidgetTwo style_2={style_2} cls="col-lg-2 col-md-3 col-sm-4" />
            {/* widget three */}
            <WidgetThree style_2={style_2} cls="col-lg-2 col-md-3 col-sm-4" />
            {/* widget end */}
            <div className="col-lg-4 mb-20 footer-newsletter">
              <h5 className={`footer-title ${style_2 ? 'text-white' : ''}`}>
                Newsletter
              </h5>
              <p className={`${style_2 ? 'text-white' : ''}`}>
                Join & get important new regularly
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className={`d-flex ${style_3 ? 'border-style' : ''}`}
              >
                <input 
                  type="email" 
                  placeholder="Enter your email*" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </form>
              <p className="note">
                We only send interesting and relevant emails.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bottom-footer ${bottom_bg} ${style_2 ? 'mt-50 lg-mt-20' : ''}`}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 order-lg-3 mb-15">
              <ul className="style-none d-flex order-lg-last justify-content-center justify-content-lg-end social-icon">
                <SocialLinks />
              </ul>
            </div>
            <div className="col-lg-4 order-lg-1 mb-15">
              <ul className="d-flex style-none bottom-nav justify-content-center justify-content-lg-start">
                <li>
                  <Link className="text-decoration-none" href="/terms">
                    Privacy & Terms.
                  </Link>
                </li>
                <li>
                  <Link className="text-decoration-none" href="/contact">
                    {' '}
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 order-lg-2">
              <p className={`text-center mb-15 ${style_2 ? 'text-white' : ''}`}>
                Copyright @{new Date().getFullYear()} Ugandan Jobs inc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterOne;

'use client';
import React, { useEffect, useState } from 'react';
import whatsappIcon from '@/assets/images/icon/whatsapp.svg';
import Link from 'next/link';
import Image from 'next/image';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 200) {
      // Show after scrolling 50 pixels
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const defaultMsg =
    message || 'Hello, I would like to know about your services';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    defaultMsg
  )}`;

  const buttonStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '65px',
    right: '5px',
    zIndex: '1000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    opacity: isVisible ? 1 : 0, // Toggle visibility
    transition: 'opacity 0.1s'
  };

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={buttonStyles}
    >
      <Image src={whatsappIcon} width={45} height={45} alt="whatsapp icon" />
    </Link>
  );
};

export default WhatsAppButton;

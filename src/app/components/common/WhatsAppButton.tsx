import React from 'react';
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
    cursor: 'pointer'
  };

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={buttonStyles}
    >
      <Image src={whatsappIcon} width={40} height={40} alt="whatsapp icon" />
    </Link>
  );
};

export default WhatsAppButton;

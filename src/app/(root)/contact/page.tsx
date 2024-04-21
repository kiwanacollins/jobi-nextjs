import React from 'react';
import { Metadata } from 'next';
import MapArea from '../../components/contact/map-area';
import ContactArea from '../../components/contact/contact-area';

export const metadata: Metadata = {
  title: 'Contact | OneSkill',
  description:
    "Have questions or need assistance? Reach out to the OneSkill team. We're here to help you with any inquiries regarding job postings, candidate searches, or general information."
};

const ContactPage = () => {
  return (
    <>
      {/*MapArea start */}
      <MapArea />
      {/*MapArea end */}

      {/* contact area start */}
      <ContactArea />
      {/* contact area end */}
    </>
  );
};

export default ContactPage;

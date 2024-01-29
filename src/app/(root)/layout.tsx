import FooterOne from '@/layouts/footers/footer-one';
import HeaderSix from '@/layouts/headers/header-6';
import Wrapper from '@/layouts/wrapper';
import React from 'react';

const HomeRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <HeaderSix />
        {/* header end */}
        {children}
        {/* footer start */}
        <FooterOne style_2={true} />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};
export default HomeRootLayout;

import React from 'react';
import { Metadata } from 'next';
import Wrapper from '@/layouts/wrapper';
import CompanyBreadcrumb from '../../components/common/common-breadcrumb';
import FooterOne from '@/layouts/footers/footer-one';

import SignInArea from '@/app/components/sign-in/signin-area';
import HeaderSix from '@/layouts/headers/header-6';

export const metadata: Metadata = {
  title: 'Sign In'
};

const SignInPage = () => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* header start */}
        <HeaderSix />
        {/* header end */}

        {/*breadcrumb start */}
        <CompanyBreadcrumb
          title="Sign In"
          subtitle="Sign in to your account & Start posting or hiring talents"
        />
        {/*breadcrumb end */}

        {/* register area start */}
        <SignInArea />
        {/* register area end */}

        {/* footer start */}
        <FooterOne />
        {/* footer end */}
      </div>
    </Wrapper>
  );
};

export default SignInPage;

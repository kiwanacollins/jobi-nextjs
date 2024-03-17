import FooterOne from '@/layouts/footers/footer-one';
import HeaderSix from '@/layouts/headers/header-6';
import Wrapper from '@/layouts/wrapper';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs';
import React from 'react';

const HomeRootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  const currentUser = await getUserById({ userId });

  return (
    <Wrapper>
      {/* header start */}
      <HeaderSix
        userId={userId?.toString()}
        currentUser={JSON.parse(JSON.stringify(currentUser))}
      />
      {/* header end */}
      {children}
      {/* footer start */}
      <FooterOne style_2={true} />
      {/* footer end */}
    </Wrapper>
  );
};
export default HomeRootLayout;

import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="d-flex align-items-center justify-content-center vh-100  w-full ">
      {children}
    </main>
  );
};

export default Layout;

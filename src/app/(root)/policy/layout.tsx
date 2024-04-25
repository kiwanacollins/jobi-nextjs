import React from 'react';
import CompanyBreadcrumb from '../../components/common/common-breadcrumb';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CompanyBreadcrumb
        title="Privacy Policy"
        subtitle="Please read the following privacy policy carefully before using our website."
      />
      <div className="w-100 mt-4 p-4 d-flex  justify-content-center  align-items-center ">
        <article>{children}</article>
      </div>
    </>
  );
};
export default layout;

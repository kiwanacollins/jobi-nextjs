import { UserProfile } from '@clerk/nextjs';
import CompanyBreadcrumb from '../../components/common/common-breadcrumb';

const page = () => {
  return (
    <div>
      <CompanyBreadcrumb
        title="Profile"
        subtitle="Review your profile and update your information."
      />

      <section className="d-flex container align-items-center justify-content-center py-5 my-5">
        <UserProfile />
      </section>
    </div>
  );
};
export default page;

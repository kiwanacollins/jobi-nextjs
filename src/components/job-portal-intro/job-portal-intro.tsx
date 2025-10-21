import React from 'react';
import Link from 'next/link';
import { IUser } from '@/database/user.model';

const JobPortalIntro = ({
  top_border = false,
  loggInUser
}: {
  top_border?: boolean;
  loggInUser?: IUser;
}) => {
  return (
    <section className="job-portal-intro">
      <div className="container">
        <div
          className={`wrapper bottom-border ${top_border ? 'top-border' : ''} pt-100 lg-pt-80 md-pt-50 pb-65 md-pb-50`}
        >
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div
                className="text-center text-lg-start wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <h2>Uganda&apos;s trusted job portal for ambitious seekers.</h2>
                <p className="text-md m0 md-pb-20">
                  Create a profile, shortlist roles across Uganda and land remote opportunities with employers worldwide.
                </p>
              </div>
            </div>
            {/* Removed action buttons (Looking for job? / Post a job) per request */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobPortalIntro;

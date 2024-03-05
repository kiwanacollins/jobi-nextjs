import React from 'react';
import { UserProfile } from '@clerk/nextjs';

const DashboardSettingArea = () => {
  return (
    <div className="position-relative">
      <h2 className="main-title">Account Settings</h2>

      <div className="bg-white card-box border-20">
        <h4 className="dash-title-three">Edit & Update</h4>
        <div className="d-flex container align-items-center justify-content-center py-5">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default DashboardSettingArea;

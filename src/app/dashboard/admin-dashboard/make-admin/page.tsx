'use client';
import { makeUserAdmin } from '@/lib/actions/admin.action';
import { notifySuccess } from '@/utils/toast';
import React, { useState } from 'react';

const Page = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const makeAdmin = async () => {
    setIsSubmitting(true);
    try {
      await makeUserAdmin({
        email
      });

      setEmail('');
      notifySuccess('Admin created successfully');
      setIsSubmitting(false);
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
    } finally {
      setEmail('');
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <div className="dash-input-wrapper mb-30">
        <label htmlFor="">Make Admin*</label>
        <div className="skills-wrapper">
          <div className="dash-input-wrapper mb-30">
            <input
              type="text"
              placeholder="Make admin by email address"
              value={email}
              onChange={handleEmailChange}
            />
            <button onClick={makeAdmin} className="btn btn-primary mt-3 p-3">
              {isSubmitting ? 'Submitting...' : 'Make Admin'}
            </button>
          </div>
        </div>
      </div>

      {/* Skills end */}
    </div>
  );
};
export default Page;

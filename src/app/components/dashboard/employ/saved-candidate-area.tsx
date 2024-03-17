'use client';
import React, { useState } from 'react';
import { IUser } from '@/database/user.model';
import CandidateListItem from '../../candidate/candidate-list-item';
import Swal from 'sweetalert2';
import { shareSavedCandidates } from '@/lib/actions/employee.action';

interface ISavedCandidateArea {
  candidates: IUser[];
  loggedInUser?: IUser;
}

const SavedCandidateArea = ({
  candidates,
  loggedInUser
}: ISavedCandidateArea) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleShareWithAdmin = (employeeId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to share this saved candiate with admin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, share it!'
    }).then(async (result) => {
      setIsLoading(true);
      if (result.isConfirmed) {
        const res = await shareSavedCandidates({
          employeeId
        });
        console.log('shareSavedCandidates', res);
        if (res.success) {
          Swal.fire({
            title: 'Shared!',
            text: res.message,
            icon: 'success'
          });
          setIsLoading(false);
        }
      }
    });
  };
  return (
    <div className="candidates-profile position-relative">
      <div className="d-flex flex-column gap-3  flex-md-row  align-items-center justify-content-between mb-40 lg-mb-30">
        <h2 className="main-title m0">Saved Candidate</h2>
        <div className="short-filter d-flex align-items-center">
          <button
            disabled={isLoading}
            onClick={() =>
              handleShareWithAdmin(loggedInUser?.clerkId as string)
            }
            className="btn btn-success p-2 position-relative"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sharing...
              </>
            ) : (
              'Share with Admin'
            )}
          </button>
        </div>
      </div>

      <div className="accordion-box list-style show">
        {candidates.map((item: IUser) => (
          <CandidateListItem
            loggedInUser={loggedInUser}
            key={item._id}
            item={item}
          />
        ))}
      </div>
      {candidates.length === 0 && (
        <div className="text-center">
          <h3>No candidates saved Yet</h3>
        </div>
      )}

      <div className="dash-pagination d-flex justify-content-end mt-30">
        <ul className="style-none d-flex align-items-center">
          <li>
            <a href="#" className="active">
              1
            </a>
          </li>
          <li>
            <a href="#">2</a>
          </li>
          <li>
            <a href="#">3</a>
          </li>
          <li>..</li>
          <li>
            <a href="#">7</a>
          </li>
          <li>
            <a href="#">
              <i className="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SavedCandidateArea;

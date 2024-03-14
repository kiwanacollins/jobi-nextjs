import React from 'react';
import LoginForm from '@/app/components/forms/login-form';

const CategoryModal = () => {
  return (
    <div
      className="modal fade"
      id="categoryModal"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="container">
          <div className="user-data-form modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <div className="text-center">
              <h2>Add Category</h2>
            </div>
            <div className="form-wrapper">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

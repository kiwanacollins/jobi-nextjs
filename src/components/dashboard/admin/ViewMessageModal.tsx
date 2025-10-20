import Link from 'next/link';
import React from 'react';

interface IViewMessageModalProps {
  message: string;
  name: string;
  email: string;
  id: string;
  subject?: string;
}

const ViewMessageModal = ({
  message,
  name,
  email,
  id,
  subject
}: IViewMessageModalProps) => {
  return (
    <div
      className="modal fade"
      id={`viewMessageModal-${id}`}
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <div>
              <h5 className="modal-title fw-bold mb-1" id="viewMessageModal">
                {name}
              </h5>
              <p className="text-muted mb-0 small">{email}</p>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body px-4 py-4">
            <div className="mb-4">
              <h6 className="text-muted small text-uppercase mb-2">Subject</h6>
              <p className="fw-500 fs-5 mb-0">{subject || 'No subject'}</p>
            </div>
            <div>
              <h6 className="text-muted small text-uppercase mb-2">Message</h6>
              <p className="lh-lg" style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
            </div>
          </div>
          <div className="modal-footer border-top">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <Link
              href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your message')}&body=In response to your message:%0D%0A"${encodeURIComponent(message)}"%0D%0A%0D%0AHello ${name},%0D%0A%0D%0A`}
              title="Reply to message"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Reply via Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMessageModal;

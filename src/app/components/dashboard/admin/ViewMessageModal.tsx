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
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="viewMessageModal">
              {name} - {email}
            </h5>
          </div>
          <div className="mt-5 p-5 ">
            <div className="">{message}</div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <Link
              href={`mailto:${email}?subject=${subject}%20Here&body=In response to your message:%0D%0A"${message}"%0D%0A%0D%0AHello${' ' + name},%0D%0A%0D%0A`}
              title="Reply to message"
              className="btn btn-primary"
            >
              Reply
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMessageModal;

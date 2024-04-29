'use client';

import { removeFromAdmin } from '@/lib/actions/admin.action';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface IAdminItemProps {
  id: string;
  name: string;
  email: string;
  status: string;
  serial: number;
}

const AdminItem = ({ name, email, status, id, serial }: IAdminItemProps) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const handleRemoveAdmin = async (userId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then(async (result) => {
      setIsLoading(true);
      if (result.isConfirmed) {
        const res = await removeFromAdmin({
          userId,
          path: pathname
        });
        if (res?.success) {
          Swal.fire({
            title: 'Removed!',
            text: res?.message,
            icon: 'success'
          });
          setIsLoading(false);
        }
        if (res?.error) {
          Swal.fire({
            title: 'Error!',
            text: res?.message,
            icon: 'error'
          });
          setIsLoading(false);
        }
      }
    });
  };
  return (
    <tr className={status}>
      <td>
        <div className="job-name fw-500">{serial}</div>
      </td>
      <td>
        <div className="job-name fw-500">{name}</div>
      </td>
      <td>
        <div className="job-name fw-500">{email}</div>
      </td>
      <td>
        <div className="job-status text-capitalize">{status}</div>
      </td>
      <td>
        <div className="action-dots float-end">
          <button
            onClick={() => handleRemoveAdmin(id)}
            title="Remove from admin"
            disabled={isLoading}
            className="btn btn-danger"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Removing...
              </>
            ) : (
              'Remove'
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};
export default AdminItem;

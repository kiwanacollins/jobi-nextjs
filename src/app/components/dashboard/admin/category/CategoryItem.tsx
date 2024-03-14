'use client';
import { usePathname } from 'next/navigation';
import { deleteSingleCategory } from '@/lib/actions/admin.action';
import Swal from 'sweetalert2';

import Link from 'next/link';

interface ICategoryItem {
  name: string;
  id?: number;
  categoryId?: string;

  subcategory?: { name: string }[];
}

const CategoryItem = ({ id, categoryId, name, subcategory }: ICategoryItem) => {
  const pathname = usePathname();

  const handleDeleteCategory = async (id: string) => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You cannot recover this message!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteSingleCategory({
            mongoId: id,
            path: pathname
          });
          if (response.success) {
            Swal.fire({
              title: 'Deleted!',
              text: response?.message,
              icon: 'success'
            });
          }
        }
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <tr>
        <td>
          <div className="job-name fw-500">{id}</div>
        </td>
        <td>
          <div className="job-name fw-500">{name}</div>
        </td>
        <td>
          <div className=" d-flex flex-wrap gap-2 ">
            {subcategory?.map((sub, index) => (
              <span key={index} className="badge bg-success py-1 px-2 ">
                {sub.name}
              </span>
            ))}
          </div>
        </td>
        <td>
          <div className="action-dots d-flex  float-end gap-2 ">
            <Link
              href={`/dashboard/admin-dashboard/categories/${categoryId}`}
              title="edit category"
              className="btn btn-primary"
            >
              Edit
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCategory(categoryId as string);
              }}
              title="Remove from category"
              className="btn btn-danger"
            >
              X
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};
export default CategoryItem;

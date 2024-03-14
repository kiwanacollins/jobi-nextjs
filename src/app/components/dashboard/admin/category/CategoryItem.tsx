import CategoryModal from './CategoryModal';

interface ICategoryItem {
  id: string;
  name: string;
  subcategory: string[];
}

const CategoryItem = ({ id, name, subcategory }: ICategoryItem) => {
  return (
    <>
      <tr>
        <td>
          <div className="job-name fw-500">{name}</div>
        </td>
        <td>
          <div className="job-name fw-500">{subcategory.join(',')}</div>
        </td>
        <td>
          <div className="action-dots d-flex  float-end gap-2 ">
            <button
              data-bs-toggle="modal"
              data-bs-target="#categoryModal"
              title="edit category"
              className="btn btn-primary"
            >
              Edit
            </button>
            <button title="Remove from category" className="btn btn-danger">
              X
            </button>
          </div>
        </td>
      </tr>
      <CategoryModal />
    </>
  );
};
export default CategoryItem;

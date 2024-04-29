import { ICategory } from '@/database/category.model';
import CategoryItem from './CategoryItem';

interface ICategoryTable {
  categories: ICategory[];
}

const CategoriesTable = ({ categories }: ICategoryTable) => {
  return (
    <div className="table-responsive">
      <table className="table job-alert-table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Category Name</th>
            <th scope="col">SubCategory</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="border-0">
          {categories?.map((category, index) => (
            <CategoryItem
              key={category._id}
              id={index + 1}
              categoryId={category._id}
              name={category.name}
              subcategory={category.subcategory}
            />
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default CategoriesTable;

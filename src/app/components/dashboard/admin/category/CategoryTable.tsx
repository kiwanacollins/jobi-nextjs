import CategoryItem from './CategoryItem';

interface ICategoryTable {
  categories: {
    _id: string;
    name: string;
    subcategory: string[];
  }[];
}

const CategoriesTable = ({ categories }: ICategoryTable) => {
  return (
    <div className="table-responsive">
      <table className="table job-alert-table">
        <thead>
          <tr>
            <th scope="col">Category Name</th>
            <th scope="col">SubCategory</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="border-0">
          <CategoryItem
            id={'1'}
            name={'Graphics Design'}
            subcategory={['Logo', 'Banner', 'Business Card']}
          />

          <CategoryItem
            id={'2'}
            name={'Web Development'}
            subcategory={['Frontend', 'Backend', 'Fullstack']}
          />

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

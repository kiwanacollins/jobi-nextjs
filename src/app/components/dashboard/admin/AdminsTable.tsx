import AdminItem from './AdminItem';

interface AdminsTableProps {
  admins: {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }[];
}

const AdminsTable = ({ admins }: AdminsTableProps) => {
  return (
    <div className="table-responsive">
      <table className="table job-alert-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody className="border-0">
          {admins?.map((admin) => (
            <AdminItem
              key={admin._id}
              name={admin.name}
              email={admin.email}
              status={admin.isAdmin ? 'active' : 'Inactive'}
            />
          ))}

          {admins.length === 0 && (
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
export default AdminsTable;

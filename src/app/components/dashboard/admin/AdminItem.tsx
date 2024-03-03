interface IAdminItemProps {
  name: string;
  email: string;
  status: string;
}

const AdminItem = ({ name, email, status }: IAdminItemProps) => {
  return (
    <tr className={status}>
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
          <button title="Remove from admin" className="btn btn-danger">
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
};
export default AdminItem;
